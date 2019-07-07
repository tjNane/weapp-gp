Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 图片路径
    imageSrc: {
      type: String,
      value: ''
    },
    // 提示文字
    tipText: {
      type: String,
      value: ''
    },
    // 是否显示按钮
    showBtn: {
      type: Boolean,
      value: false
    },
    // 按钮文字
    btnText: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 按钮点击事件
    tapBtn() {
      this.triggerEvent("navigator")
    }
  }
})
