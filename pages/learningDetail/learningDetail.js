import { appRequest } from '../../utils/request.js'
import { punchCard, workInfo } from '../../api/mySubject.js'
import { courseDetail, courseList } from '../../api/goodCourse.js'
import { toTimestamp } from '../../utils/util.js'

const WxParse = require('../../utils/wxParse/wxParse.js')
const app = getApp()
Page({

  data: {
    // 页面传参
    courseId: '',
    // 切换tab
    tabs: [
      { id: 1, text: '课程大纲' },
      { id: 2, text: '相关课程' }
    ],
    // 当前选中的tab
    currentTab: 0,
    // 顶部直播标题
    onAirTitle: '',
    // 课程介绍
    courseIntrodution: {},
    // 全部老师介绍列表
    teacherList: [],
    // 展示中老师列表
    partTeacherList: [],
    // 是否查看全部老师
    isCheakAll: false,
    // 当前展开
    currentSlide: 0,
    // 腾讯课堂地址
    tencentCorseUrl: '',
    // 是否显示打卡弹窗
    showMadal: false,
    // 学习进度
    progress: '',
    // 大纲列表
    outlineList: [],
    // 当前时间戳
    timestamp: '',
    // 热门课程
    hotList: [],
    // 折扣课程
    discountList: [],
    // 是否加载过相关课程
    loadedRelativeCourse: false,
    // 课程标题
    title: '',
    // 分享海报传参标题
    shareTitle: '',
    // 分享海报课程id
    arrangementId: ''
  },

  onShow() {
    this.getPunchCardInfo(this.data.courseId)
  },

  onLoad: function (options) {
    let courseId = options.courseId
    this.setData({ courseId })
    this.getCurrentTime()

    // 从缓存获取腾讯课堂直播地址
    wx.getStorage({
      key: 'url',
      success: res => {
        this.setData({
          tencentCorseUrl: res.data,
          title: options.title
        })
      },
    })

    // 如果未打卡并且在直播时间，则打卡一次
    if (+options.arrangement) {
      this.setData({ showMadal: true })
    }
  },

  onReady() {
    this.clock = this.selectComponent("#clock")
    this.submit = this.selectComponent("#submit")
  },

  // 切换tab
  switchTab(e) {
    let index = e.currentTarget.dataset.idx
    this.setData({ currentTab: index })
    if (index == 1 && !this.data.loadedRelativeCourse) {
      this.getReletiveList()
      this.setData({ loadedRelativeCourse: true })
    }
  },

  // 课程大纲收缩展开
  toggleSlide(e) {
    let index = e.currentTarget.dataset.idx
    this.setData({ currentSlide: index })
  },

  // 打卡
  clockIn() {
    this.punchCard(this.data.courseId)
    this.setData({ showMadal: false })
    this.clock.openModal()
  },

  // 前往腾讯课堂
  goToTencent() {
    wx.navigateToMiniProgram({
      appId: app.globalData.tencentCourseAppid,
      path: this.data.tencentCorseUrl
    })
  },

  // 打开提交作业页面
  submitWorks(e) {
    let arrangementId = e.currentTarget.dataset.arrangementid
    let vipcourseid = e.currentTarget.dataset.vipcourseid
    wx.navigateTo({
      url: `../submitWorks/submitWorks?arrangementId=${arrangementId}&vipcourseid=${vipcourseid}`,
    })
  },

  // 跳转我的作业
  toMyWorks() {
    wx.setStorage({
      key: 'myWorks',
      data: this.data.outlineList,
      success: () => {
        wx.navigateTo({ url: '../myWorks/myWorks' })
      }
    })
  },

  // 跳转打卡详情
  toClock() {
    wx.navigateTo({ url: `../clockIn/clockIn?id=${this.data.courseId}` })
  },

  // 跳转打卡分享页面
  goToShare() {
    this.punchCard(this.data.courseId)
    wx.navigateTo({
      url: `../shareClock/shareClock?title=${this.data.shareTitle}&ids=${this.data.courseId}&arrangementId=${this.data.arrangementId}`
    })
    this.setData({ showMadal: false })
  },

  // 查看所有老师
  checkAllTeacher() {
    this.setData({
      isCheakAll: true,
      partTeacherList: this.data.teacherList
    })
  },


  // 打卡
  punchCard(id) {
    appRequest(punchCard, { vipCourceId: id }).then(res => {})
  },

  // 获取打卡信息
  getPunchCardInfo(id) {
    appRequest(workInfo, { arrangementCourseid: id }).then(res => {
      let outlineList = res.data.classList
      outlineList.forEach((ele, index) => {
        ele.listArrangement.forEach(item => {
          let start = toTimestamp(item.arrangementStartTime)
          let end = toTimestamp(item.arrangementEndTime)
          item.startTimestamp = start
          item.endTimestamp = end
          if (start < this.data.timestamp && end > this.data.timestamp) {
            this.setData({ currentSlide: index, onAirTitle: item.arrangementName })
            this.setData({
              shareTitle: item.arrangementName,
              arrangementId: item.arrangementId
            })
          }
        })
      })
      this.setData({
        progress: res.data.progress.substring(0, res.data.progress.length - 1),
        outlineList
      })
    })
  },

  // 获取当前时间戳
  getCurrentTime() {
    let timestamp = Date.parse(new Date())
    this.setData({ timestamp })
  },

  // 获取首页课程列表
  getReletiveList() {
    appRequest(courseList).then(res => {
      this.setData({
        hotList: res.data.hotList,
        discountList: res.data.discountList
      })
    })
  },

  // 跳转腾讯课堂
  goTencent() {
    wx.navigateToMiniProgram({
      appId: app.globalData.tencentCourseAppid,
      path: this.data.tencentCorseUrl
    })
  },
  
  // 分享
  onShareAppMessage() {
    return {
      title: `快来一起学习${this.data.title}吧~`,
      path: `pages/index/index`
    }
  }
})