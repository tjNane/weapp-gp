Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 是否有圆角
    haveRadius: {
      type: Boolean,
      value: true
    },
    // 是否显示关闭按钮
    showCloseBtn: {
      type: Boolean,
      value: true
    },
    // 是否可以触屏滑动
    move: {
      type: String,
      value: 'move'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow: false,
    animationData: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 显示
    showPopUp() {
      this.showAnimation()
    },
    // 隐藏
    hidePopUp() {
      this.setData({ isShow: false })
    },
    // 动画
    showAnimation() {
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      })
      this.animation = animation
      animation.translateY(300).step()
      this.setData({
        animationData: animation.export(),
        isShow: true
      })
      setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export()
        })
      }.bind(this), 20)
    },
    move() {}
  }
})
