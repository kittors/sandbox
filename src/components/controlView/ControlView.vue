<template>
  <div>
    <vxe-toolbar>
      <template #buttons>
        <div class="sheetStyle" v-show="changeSheetFlag === '1'">
          <vxe-button content="更改表格"></vxe-button>
          <vxe-button content="突出显示" @click="heightLight"></vxe-button>
          <vxe-button
            content="移除突出显示"
            @click="removeHeightLight"
          ></vxe-button>
          <!-- <vxe-button content="按钮3"></vxe-button> -->
          <vxe-button content="文本位置">
            <template #dropdowns>
              <vxe-button
                content="最右"
                @click="changeFontStyle('right')"
              ></vxe-button>
              <vxe-button
                content="垂直水平居中"
                @click="changeFontStyle('center')"
              ></vxe-button>
              <vxe-button
                content="最左"
                @click="changeFontStyle('left')"
              ></vxe-button>
            </template>
          </vxe-button>
        </div>
        <div class="sheetClass" v-show="changeSheetFlag === '2'">
          <vxe-button content="字符" @click="addCharClass"></vxe-button
          ><vxe-input
            v-model="val1"
            placeholder="填入数字"
            size="mini"
            type="number"
          ></vxe-input>
          <vxe-button content="数值" @click="addNumberClass"></vxe-button
          ><vxe-input
            v-model="val2"
            placeholder="填入数字"
            size="mini"
            type="number"
          ></vxe-input>
        </div>
      </template>
    </vxe-toolbar>
  </div>
</template>

<script>
export default {
  props: {
    changeSheetFlag: {
      type: String,
      default: "1",
    },
  },
  watch: {
    changeFlag(newValue, oldValue) {
      console.log(newValue);
    },
  },
  data() {
    return {
      val1: 20,
      val2: 0,
    };
  },
  methods: {
    heightLight() {
      this.$emit("heightLight");
    },
    removeHeightLight() {
      this.$emit("removeHeightLight");
    },
    addCharClass() {
      this.$emit("addCharClass", this.val1, "#800000");
    },
    addNumberClass() {
      this.$emit("addNumberClass", this.val2, "#000080");
    },
    changeFontStyle(style) {
      this.$emit("changeFontStyle", style);
    },
  },
};
</script>

<style lang="less" scoped></style>
