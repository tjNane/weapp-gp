const app = getApp()
Page({

  data: {
    // 轮播图列表
    publicCourseList: [],
    // 当前图片下标
    swiperIndex: 0,
    // 当前展示课程标题
    courseTitle: '',
    // 当前时间戳
    timestamp: ''
  },

  onLoad: function (options) {
    this.getPublicCourseList()
    this.getCurrentTime()
  },

  // 轮播图滑动
  bindchange(e) {
    let swiperIndex = e.detail.current
    let filterRes = this.data.publicCourseList.filter((ele, index) => index == swiperIndex)
    this.setData({
      swiperIndex,
      courseTitle: filterRes[0].course_name
    })
  },

  // 获取公开课列表
  getPublicCourseList() {
    let publicCourseList = wx.getStorageSync('publicCourse')
    this.setData({ 
      publicCourseList,
      courseTitle: publicCourseList[0].course_name
    })
  },

  // 获取当前时间戳
  getCurrentTime() {
    let timestamp = Date.parse(new Date())
    this.setData({ timestamp })
  },

  // 页面卸载清除本页数据缓存
  onUnload() {
    wx.removeStorageSync('publicCourse')
  },

  // 跳转腾讯课堂
  navToCourse(e) {
    wx.navigateToMiniProgram({
      appId: app.globalData.tencentCourseAppid,
      path: e.currentTarget.dataset.url
    })
  },
})