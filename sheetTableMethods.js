export const contextmenuEvent = {
  methods: {
    // 合并单元格
    async custom_mergeCell(selectionRangeKeys, selectionRangeIndexes) {
      let { startRowIndex, endRowIndex, startColIndex, endColIndex } = selectionRangeIndexes
      if (startRowIndex === endRowIndex && startColIndex === endColIndex) {
        this.$message.warning('请选择区域进行合并')
        return
      }
      // 需要先拿到所有的列
      // map column
      const mergeCellCol = {
        merge: [], // 需要占列的开始
        reset: [] // 需要清零占位的列
      }
      this.columns.map((_l, _l_x) => {
        if (_l_x === startColIndex) {
          mergeCellCol.merge.push(_l.field)
        }
        if (_l_x > startColIndex && _l_x <= endColIndex) {
          mergeCellCol.reset.push(_l.field)
        }
      })
      // 查看是否存在锁定单元格
      let value = await this.checkDisabledCell(mergeCellCol.merge, startRowIndex, endRowIndex)
      let value1 = await this.checkDisabledCell(mergeCellCol.reset, startRowIndex, endRowIndex)
      if (!value || !value1) {
        this.$message.warning('存在锁定中单元格')
        return
      }
      // map data 数据
      const tableData = JSON.parse(JSON.stringify(this.tableData))
      await tableData.map((_r, _r_x) => {
        // if ()
        // 如何是合并的起始 行
        if (_r_x === startRowIndex) {
          // 如果没有旧的合并单元格
          if (!_r.mergeCell) {
            _r.mergeCell = {}
          }
          mergeCellCol.merge.map(item => {
            _r.mergeCell[item] = {
              'rowspan': (endRowIndex - startRowIndex) + 1,
              'colspan': (endColIndex - startColIndex) + 1
            }
          })
          mergeCellCol.reset.map(item => {
            _r.mergeCell[item] = {
              'rowspan': 0,
              'colspan': 0
            }
          })
        }
        // 取到合并的行 并附 rowspan 为0  colspan 为 0
        if (_r_x > startRowIndex && _r_x <= endRowIndex) {
          if (!_r.mergeCell) {
            _r.mergeCell = {}
          }
          mergeCellCol.merge.map(item => {
            _r.mergeCell[item] = {
              'rowspan': 0,
              'colspan': 0
            }
          })
          mergeCellCol.reset.map(item => {
            _r.mergeCell[item] = {
              'rowspan': 0,
              'colspan': 0
            }
          })
        }
        return _r
      })
      this.tableData = JSON.parse(JSON.stringify(tableData))
      this.$message.success('操作成功！')
    },
    // 查看是否有锁定中单元格
    checkDisabledCell(data, startRowIndex, endRowIndex) {
      let value = true
      data.map(_cellKey => {
        this.tableData.map((item, index) => {
          if (index >= startRowIndex && index <= endRowIndex) {
            if (item.disabledEditCell && item.disabledEditCell.includes(_cellKey)) {
              value = false
            }
          }
        })
      })
      return value
    }
  }
}