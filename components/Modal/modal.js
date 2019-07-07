Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 内容
    content: {
      type: String,
      value: '弹窗内容'
    },
    // 取消按钮文字
    cancelBtn: {
      type: String,
      value: '取消'
    },
    // 确定按钮文字
    confirmBtn: {
      type: String,
      value: '确定'
    },
    // 是否显示取消按钮
    showCancel: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 显示状态
    showStatus: false
  },

  /**
   * 组件的方法列表
   */
  methods: {

    //打开弹框
    openModal() {
      this.setData({
        showStatus: true
      })
    },

    //关闭弹框
    closeModal() {
      this.setData({
        showStatus: false
      })
    },

    // 取消按钮
    cancelTap() {
      this.setData({
        showStatus: !this.data.showStatus
      })
      console.log('点击了取消')
    },

    // 确定按钮
    confirmTap() {
      this.setData({
        showStatus: !this.data.showStatus
      })
      this.triggerEvent("confirm")
      console.log('点击了确定')
    }
  }
})
