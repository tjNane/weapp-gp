import { appRequest } from '../../utils/request.js'
import { bannerList, courseList, previousList, todayPublicCourse, hotSearch } from '../../api/goodCourse.js'

const app = getApp()
Page({

  data: {
    // 轮播图当前图片下标
    swiperIndex: 0,
    // 切换tab
    tabs: [
      { id: 0, text: '为你推荐' },
      { id: 1, text: '往期录播' }
    ],
    // 当前选中的tab
    currentTab: 0,
    // 输入框提示文字
    inputPlaceholder: '',
    // 轮播图列表
    swiperList: [],
    // 今日公开课
    todayPublicCourseList: [],
    // 爆款课程
    hotList: [],
    // 折扣专区
    discountList: [],
    // 猜你喜欢
    guessLikeList: [],
    // 往期录播分类
    previousTab: [],
    // 是否加载过往期录播
    havePrevious: false,
    // 往期录播当前选中分类
    currentClassify: 0,
    // 往期录播所有列表
    previousList: [],
    // 往期录播筛选列表
    currentFilter: [],
    // 往期视录播总数
    previousLength: 0,
    // 当前时间戳
    timestamp: '',
    // 是否重新刷新页面
    isRefresh: 0
  },

  onLoad: function(options) {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          this.getBanner()
          this.getCourseList()
          this.getTodayPublicCourse()
          this.getHotSearchList()
          this.getCurrentTime()
        }
      }
    })
  },

  onShow() {
    if (this.data.isRefresh) {
      this.onLoad()
      this.setData({
        isRefresh: 0
      })
    }
  },

  // 轮播图切换
  swiperChange(e) {
    let swiperIndex = e.detail.current
    this.setData({ swiperIndex })
  },

  // 切换tab
  switchTab(e) {
    let index = e.currentTarget.dataset.idx
    this.setData({
      currentTab: index
    })
    // 首次点击第二个tab加载一次数据，默认不加载
    if (this.data.currentTab == 1 && !this.data.havePrevious) {
      this.setData({ havePrevious: true })
      this.getPreviousList()
    }
  },

  // 跳转搜索页
  navToSearch() {
    wx.navigateTo({
      url: '../searchPage/searchPage',
    })
  },

  // 往期录播点击分类
  chooseClassify(e) {
    let id = e.currentTarget.dataset.id
    this.setData({
      currentClassify: id
    })
    let filterRes = this.data.previousTab.filter(ele => ele.crmCourseid == id)
    if (filterRes.length) {
      let previousList = []
      for (const v of filterRes) {
        previousList.push(...v.courseList)
      }
      this.setData({
        currentFilter: previousList
      })
    } else {
      this.setData({
        currentFilter: this.data.previousList
      })
    }
  },

  // 跳转今日公开课
  navToTodayCourse() {
    wx.navigateTo({
      url: `../todayCourse/todayCourse`,
      success: () => {
        wx.setStorageSync('publicCourse', this.data.todayPublicCourseList)
      }
    })
  },

  // 跳转腾讯课堂
  navToCourse(e) {
    wx.navigateToMiniProgram({
      appId: app.globalData.tencentCourseAppid,
      path: e.currentTarget.dataset.url
    })
  },

  // 获取轮播图
  getBanner() {
    appRequest(bannerList).then(res => {
      if (res.success) {
        this.setData({ swiperList: res.data.rows })
      }
    })
  },

  // 获取首页课程列表
  getCourseList() {
    appRequest(courseList).then(res => {
      this.setData({
        hotList: res.data.hotList,
        discountList: res.data.discountList,
        guessLikeList: res.data.guessLikeList
      })
    })
  },

  // 获取往期录播列表及分类
  getPreviousList() {
    appRequest(previousList).then(res => {
      let previousList = []
      for (const v of res.data) {
        previousList.push(...v.courseList)
      }
      this.setData({
        previousList,
        previousLength: previousList.length,
        previousTab: res.data,
        currentFilter: previousList
      })
    })
  },

  // 获取今日公开课
  getTodayPublicCourse() {
    appRequest(todayPublicCourse).then(res => {
      for (const v of res.data) {
        if (+new Date(v.start_time).getMinutes() < 10) {
          v.startTime = new Date(v.start_time).getHours() + ":0" + new Date(v.start_time).getMinutes()
        } else {
          v.startTime = new Date(v.start_time).getHours() + ":" + new Date(v.start_time).getMinutes()
        }
      }
      this.setData({
        todayPublicCourseList: res.data
      })
      if (res.data.length) {
        this.getCurrentTime()
      }
    })
  },

  // 获取当前时间戳
  getCurrentTime() {
    let timestamp = Date.parse(new Date())
    this.setData({ timestamp })
  },

  // 获取热搜关键字列表
  getHotSearchList() {
    appRequest(hotSearch).then(res => {
      this.setData({
        inputPlaceholder: res.data.rows[0].hotvalue
      })
    })
  },

  // 跳转腾讯课堂
  goTencent(e) {
    wx.navigateToMiniProgram({
      appId: app.globalData.tencentCourseAppid,
      path: e.currentTarget.dataset.url
    })
  },

  // 分享
  onShareAppMessage() {
    return {
      title: '发现好课',
      path: '/pages/index/index'
    }
  }
})