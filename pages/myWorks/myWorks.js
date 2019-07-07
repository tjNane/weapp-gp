Page({

  data: {
    // 作业列表
    workList: [],
    // 当前展开
    currentSlide: 0,
    // 暂无作业
    haveWorks: false
  },

  onLoad: function (options) {
    this.getMyWorkList()
  },

  // 课程大纲收缩展开
  toggleSlide(e) {
    let index = e.currentTarget.dataset.idx
    this.setData({ currentSlide: index })
  },

  // 获取我的作业列表
  getMyWorkList() {
    wx.getStorage({
      key: 'myWorks',
      success: res => {
        let workList = res.data
        this.setData({ workList })
        for (let v of workList) {
          for (let item of v.listArrangement) {
            if (item.homeworkList) {
              this.setData({ haveWorks: true })
              break
            }
          }
        }
      }
    })
  },

  // 页面卸载
  onUnload() {
    wx.removeStorageSync('myWorks')
  }
})