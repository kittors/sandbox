<template>
  <div style="width: 1000px">
    <HeaderNav @changeSheet="changeSheet" />
    <ControlViewVue
      @heightLight="heightLight('#808080')"
      @removeHeightLight="removeHeightLight"
      :changeSheetFlag="changeSheetFlag"
      @addCharClass="addCharClass"
      @addNumberClass="addNumberClass"
      @changeFontStyle="changeFontStyle"
    />
    <ve-table
      :max-height="800"
      :scroll-width="0"
      row-key-field-name="rowKey"
      :fixed-header="true"
      :columns="columns"
      :table-data="tableData"
      :row-style-option="rowStyleOption"
      border-y
      :virtual-scroll-option="virtualScrollOption"
      :contextmenu-body-option="contextmenuBodyOption"
      :contextmenu-header-option="contextmenuHeaderOption"
      :cellSelectionOption="cellSelectionOption"
      :editOption="editOption"
      :column-width-resize-option="columnWidthResizeOption"
      ref="tableRef"
    />
  </div>
</template>

<script>
import ControlViewVue from "../controlView/ControlView.vue";
import HeaderNav from "../headerNav/HeaderNav.vue";
import Vue from "vue";
export default {
  components: {
    ControlViewVue,
    HeaderNav,
  },
  data() {
    return {
      lastNewVal: null,
      selectedCellObj: null,
      changeSheetFlag: "1",
      columnWidthResizeOption: {
        enable: true,
        // column resize min width
        minWidth: 30,
      },
      rowsNumber: 100,
      colsNumber: 30,
      colEn: [],
      editOption: {
        beforeStartCellEditing: ({ row, column, cellValue }) => {
          console.log("beforeStartCellEditing");
          console.log("row::", row);
          console.log("column::", column);
          console.log("cellValue::", cellValue);
          console.log("---");

          if (row.rowKey === 0 && column.field === "name") {
            alert("You can't edit this cell.");
            return false;
          }
        },
        beforeCellValueChange: ({ row, column, changeValue }) => {
          this.getDomByColKeyAndRowKey(column.key, row.rowKey);
          console.log("beforeCellValueChange");
          console.log("row::", row);
          console.log("column::", column);
          console.log("changeValue::", changeValue);
          console.log("---");
          if (column.field === "number" && !/^\d+$/.test(changeValue)) {
            alert("请输入数字");
            return false;
          }
        },
        afterCellValueChange: ({ row, column, changeValue }) => {
          console.log("afterCellValueChange");
          console.log("row::", row);
          console.log("column::", column);
          console.log("changeValue::", changeValue);
          console.log("---");
          //   this.addContentText(column.key, row.rowKey, changeValue);
          this.selectedCellObj = {
            rowkey: row.rowKey,
            colkey: column.key,
            changeValue,
          };
        },
      },
      // start row index
      cellSelectionOption: {
        enable: true,
      },
      startRowIndex: 0,
      virtualScrollOption: {
        // 是否开启
        enable: false,
        // scrolling: this.scrolling,
      },
      // contextmenu header option
      contextmenuHeaderOption: {
        /*
                    before contextmenu show.
                    In this function,You can change the `contextmenu` options
                    */
        beforeShow: ({
          isWholeColSelection,
          selectionRangeKeys,
          selectionRangeIndexes,
        }) => {
          console.log("---contextmenu header beforeShow--");
          console.log("isWholeColSelection::", isWholeColSelection);
          console.log("selectionRangeKeys::", selectionRangeKeys);
          console.log("selectionRangeIndexes::", selectionRangeIndexes);
        },
        // after menu click
        afterMenuClick: ({
          type,
          selectionRangeKeys,
          selectionRangeIndexes,
        }) => {
          console.log("---contextmenu header afterMenuClick--");
          console.log("type::", type);
          console.log("selectionRangeKeys::", selectionRangeKeys);
          console.log("selectionRangeIndexes::", selectionRangeIndexes);
        },

        // contextmenus
        contextmenus: [
          {
            type: "CUT",
          },
          {
            type: "COPY",
          },
          {
            type: "SEPARATOR",
          },
          {
            type: "EMPTY_COLUMN",
          },
          {
            type: "SEPARATOR",
          },
        ],
      },

      // contextmenu body option
      contextmenuBodyOption: {
        /*
                    before contextmenu show.
                    In this function,You can change the `contextmenu` options
                    */
        beforeShow: ({
          isWholeRowSelection,
          selectionRangeKeys,
          selectionRangeIndexes,
        }) => {
          console.log("---contextmenu body beforeShow--");
          console.log("isWholeRowSelection::", isWholeRowSelection);
          console.log("selectionRangeKeys::", selectionRangeKeys);
          console.log("selectionRangeIndexes::", selectionRangeIndexes);
        },
        // after menu click
        afterMenuClick: ({
          type,
          selectionRangeKeys,
          selectionRangeIndexes,
        }) => {
          console.log("---contextmenu body afterMenuClick--");
          console.log("type::", type);
          console.log("selectionRangeKeys::", selectionRangeKeys);
          console.log("selectionRangeIndexes::", selectionRangeIndexes);
        },

        // contextmenus
        contextmenus: [
          {
            type: "CUT",
          },
          {
            type: "COPY",
          },
          {
            type: "SEPARATOR",
          },
          {
            type: "INSERT_ROW_ABOVE",
          },
          {
            type: "INSERT_ROW_BELOW",
          },
          {
            type: "SEPARATOR",
          },
          {
            type: "REMOVE_ROW",
          },
          {
            type: "EMPTY_ROW",
          },
          {
            type: "EMPTY_CELL",
          },
        ],
      },

      rowStyleOption: {
        clickHighlight: false,
        hoverHighlight: false,
      },
      // 列表头
      columns: [
        {
          field: "index",
          key: "index",
          operationColumn: true,
          title: "",
          width: 50,
          align: "center",
          renderBodyCell: ({ row, column, rowIndex }, h) => {
            return ++rowIndex;
          },
          edit: true,
        },
      ],
      // table data
      tableData: [],
    };
  },
  watch: {
    selectedCellObj(newValue, oldValue) {
      this.addContentText(
        newValue.colkey,
        newValue.rowkey,
        newValue.changeValue
      );
    },
  },
  methods: {
    changeFontStyle(style) {
      const selectedCell = this.getElementArr();
      this.updateSeletion();
      selectedCell.forEach((item) => {
        item.style.textAlign = style;
      });
    },
    getNumberFromLetterCombination(combination) {
      let result = 0;
      for (let i = 0; i < combination.length; i++) {
        const char = combination.charAt(i);
        result = result * 26 + char.charCodeAt(0) - "A".charCodeAt(0) + 1;
      }
      return result;
    },

    //根据colkey和rowkey获取输入中的DOM
    getDomByColKeyAndRowKey(colkey, rowkey) {
      const colNum = this.getNumberFromLetterCombination(colkey);
      const tbodyChildNodes = this.removeFirstElement(
        document.getElementsByClassName("ve-table-body")[0].childNodes
      );
      const Target = tbodyChildNodes[rowkey].childNodes[colNum];
      const spanElements = Target.querySelectorAll("span"); // 选择目标元素中的所有span元素
      spanElements.forEach((spanElement) => {
        spanElement.remove();
      });
    },
    //输入后添加textContent内容
    addContentText(colkey, rowkey, val) {
      const colNum = this.getNumberFromLetterCombination(colkey);
      const tbodyChildNodes = this.removeFirstElement(
        document.getElementsByClassName("ve-table-body")[0].childNodes
      );
      const Target = tbodyChildNodes[rowkey].childNodes[colNum];
      const spanElements = Target.querySelectorAll("span"); // 选择目标元素中的所有span元素
    },
    addCharClass(num, color) {
      const selectedCell = this.getElementArr();
      this.updateSeletion();
      this.addClsssSizeContent(color, selectedCell, num, "C");
    },
    addNumberClass(num, color) {
      const selectedCell = this.getElementArr();
      this.updateSeletion();
      this.addClsssSizeContent(color, selectedCell, num, "N");
    },
    //添加类型文字内容
    addClsssSizeContent(color, ObjArr, num, type) {
      console.log(color, ObjArr, num);
      ObjArr.forEach((tdElement) => {
        const spanElements = tdElement.querySelectorAll("span");
        spanElements.forEach((spanElement) => {
          spanElement.remove();
        });
        // 创建一个新的子节点
        const newChildElement = document.createElement("span");
        const textContent =
          `${type}` + (type === "N" ? (num == 0 ? "" : `.${num}`) : num);
        tdElement.style.textAlign = "center";
        tdElement.appendChild(newChildElement);
        const flag = this.generateFlag(tdElement.cellIndex - 1);
        //设置为空
        this.tableData[tdElement.parentElement.rowIndex - 2][flag] = "";
        //更新表格的数据
        const spanInfo = {
          textContent,
          color,
        };
        new Vue({
          el: newChildElement, // 将Vue实例替换<td>标签的DOM元素
          data: {
            spanInfo,
          },
          template: `<ClassType :spanInfo=spanInfo></ClassType>`, // 使用Vue组件作为模板
        });
      });
    },
    changeSheet(val) {
      this.changeSheetFlag = val;
      console.log(this.changeSheetFlag);
    },
    initTableData() {
      let data = [];
      for (let i = 0; i < this.rowsNumber; i++) {
        data.push(this.returnColObj(i));
      }
      this.tableData = data;
      setTimeout(() => {
        this.addEvent();
      }, 100);
    },
    returnColObj(i) {
      const Obj = { rowKey: i };
      this.colEn.forEach((key) => {
        Obj[key] = "";
      });
      return Obj;
    },
    // virtual scrolling
    scrolling({ startRowIndex }) {
      this.startRowIndex = startRowIndex;
    },
    initTableBody() {
      this.colEn = this.generateCreateHeader(this.colsNumber);
      this.colEn.map((item, index) => {
        this.columns.push({
          field: `${item}`,
          key: `${item}`,
          title: item,
          width: 130,
          edit: true,
          align: "center",
          renderHeaderCell: ({ column }) => {
            return <p class="ve-table-header-text-center">{column.title}</p>;
          },
        });
      });
      this.initTableData();
    },
    generateFlag(n) {
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let flag = "";
      while (n >= 0) {
        flag = alphabet[n % 26] + flag;
        n = Math.floor(n / 26) - 1;
      }
      return flag;
    },
    generateCreateHeader(n) {
      const arr = [];
      for (let i = 0; i < n; i++) {
        arr.push(this.generateFlag(i));
      }
      return arr;
    },
    //移出类数组第一个元素
    removeFirstElement(arrayLike) {
      const arr = Array.from(arrayLike); // 将类数组转换为数组
      arr.shift(); // 移除第一个元素
      return arr;
    },
    //获取所选单元格或区域的DOM对象 数组
    getElementArr() {
      const selection = this.lastNewVal;
      const endColIndex = selection.selectionRangeIndexes.endColIndex;
      const endRowIndex = selection.selectionRangeIndexes.endRowIndex;
      const startColIndex = selection.selectionRangeIndexes.startColIndex;
      const startRowIndex = selection.selectionRangeIndexes.startRowIndex;
      const tbodyChildNodes = this.removeFirstElement(
        document.getElementsByClassName("ve-table-body")[0].childNodes
      );
      const arr = [];
      if (endColIndex === startColIndex && endRowIndex === startRowIndex) {
        arr.push(
          this.removeFirstElement(tbodyChildNodes[startRowIndex].childNodes)[
            startColIndex - 1
          ]
        );
      } else {
        for (let i = startRowIndex; i <= endRowIndex; i++) {
          for (let j = startColIndex - 1; j <= endColIndex - 1; j++) {
            arr.push(this.removeFirstElement(tbodyChildNodes[i].childNodes)[j]);
          }
        }
      }
      return arr;
    },
    //高亮
    heightLight(color) {
      const selectedCell = this.getElementArr();
      this.applyColor(color, selectedCell);
    },
    //去除高亮
    removeHeightLight() {
      const selectedCell = this.getElementArr();
      console.log(selectedCell);
      this.applyColor("", selectedCell);
    },
    //给文字添加颜色
    applySizeColor(color, ObjArr) {
      ObjArr.forEach((item) => {
        console.dir(item);
        item.style.color = color;
      });
    },
    //给单元格涂上背景颜色
    applyColor(color, ObjArr) {
      this.updateSeletion();
      ObjArr.forEach((item) => {
        item.style.backgroundColor = color;
      });
    },
    //当脱离table后也选中对应的区域
    updateSeletion() {
      const selection = this.lastNewVal;
      if (!selection) return;
      const startRowKey = selection.selectionRangeKeys.startRowKey;
      const startColKey = selection.selectionRangeKeys.startColKey;
      const endRowKey = selection.selectionRangeKeys.endRowKey;
      const endColKey = selection.selectionRangeKeys.endColKey;
      if (startRowKey === endRowKey && startColKey === endColKey) {
        //选择了单个单元格
        this.setCellSelection(startRowKey, startColKey);
      } else {
        //选择了多个单元格
        this.setRangeCellSelection(
          startRowKey,
          startColKey,
          endRowKey,
          endColKey
        );
      }
    },
    //选择区域
    setRangeCellSelection(startRowKey, startColKey, endRowKey, endColKey) {
      this.$refs["tableRef"].setRangeCellSelection({
        startRowKey,
        startColKey,
        endRowKey,
        endColKey,
        // isScrollToStartCell: true, //滚动到选中的区域位置
      });
    },
    //选择单个单元格
    setCellSelection(rowKey, colKey) {
      this.$refs["tableRef"].setCellSelection({
        rowKey,
        colKey,
      });
    },
    //添加监听
    addEvent() {
      const tableRef = this.$refs["tableRef"];
      this.$watch(
        () => tableRef.getRangeCellSelection(),
        (newVal, oldVal) => {
          // 当currentValue发生变化时执行的操作
          if (newVal) {
            this.lastNewVal = newVal;
          }
        }
      );
    },
  },
  created() {
    this.initTableBody();
  },
};
</script>
