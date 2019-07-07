Page({

  data: {
    questionList: [
      {
        id: 1,
        title: '',
        content: ''
      }],
    // 当前展开
    current: -1
  },

  toggleSlide(e) {
    const index = e.currentTarget.dataset.idx
    this.setData({
      current: index
    })
  },

  // 复制文本
  clipText(e) {
    let index = e.currentTarget.dataset.idx
    let content = this.data.questionList.filter((ele, i) => i == index)
    wx.setClipboardData({
      data: content[0].content,
      success(res) {}
    })
  }
})