import { appRequest } from '../../utils/request.js'
import { courseDetail, hotList } from '../../api/goodCourse.js'
import { addTrack, addShare } from '../../api/my.js'

Page({

  data: {
    // 页面id
    pageId: '',
    // 是否为wifi环境
    isWifi: false,
    // 封面是否显示
    showCover: true,
    // 切换tab
    tabs: [
      { id: 0, text: '视频简介' },
      { id: 1, text: '相关视频' }
    ],
    // 当前选中的tab
    currentTab: 0,
    // 视频简介
    videoDetail: {},
    // 相关视频列表
    courseList: [],
    // 页码
    start: 1,
    // 分页长度
    length: 10,
    // 是否触底了
    reachBottom: false,
    // 是否加载过相关视频列表
    loadedCourse: false,
    // 是否重新刷新页面
    isRefresh: 0
  },

  onLoad: function(options) {
    this.judgeIsWifi()
    this.getDetail(options.id)
    this.recordTrack(options.id)
    this.setData({
      pageId: options.id
    })
  },

  onShow() {
    if (this.data.isRefresh) {
      let pageId = this.data.pageId
      this.judgeIsWifi()
      this.getDetail(pageId)
      this.recordTrack(pageId)
      this.setData({
        isRefresh: 0
      })
    }
  },

  // 判断当前网络是否为wifi
  judgeIsWifi() {
    wx.getNetworkType({
      success: res => {
        const networkType = res.networkType
        if (networkType == 'wifi') {
          console.log('当前环境wifi')
          this.setData({
            isWifi: true,
            showCover: false
          })
        }
      }
    })
  },

  // 播放视频(当前非wifi环境)
  playVideo() {
    let video = wx.createVideoContext('video')
    this.setData({
      showCover: false
    })
    video.play()
  },

  // 切换tab
  switchTab(e) {
    let index = e.currentTarget.dataset.idx
    this.setData({
      currentTab: index
    })
    if (index == 1 && !this.data.loadedCourse) {
      this.getHotList()
      this.setData({ loadedCourse: true })
    }
  },

  // 获取详情
  getDetail(id) {
    appRequest(courseDetail, { id }).then(res => {
      this.setData({
        videoDetail: res.data.courseDO
      })
    })
  },
  // 获取课程列表
  getHotList() {
    let pageNo = this.data.start
    let pageSize = this.data.length

    appRequest(hotList, { pageNo, pageSize }).then(res => {
      if (res.data.length) {
        let list = this.data.courseList
        list.push(...res.data)
        this.setData({ courseList: list })
        if (this.data.courseList.length % 10 != 0) {
          this.setData({ reachBottom: true })
        }
      } else {
        this.setData({ reachBottom: true })
      }
    })
  },

  // 触底加载更多数据
  onReachBottom() {
    let start = this.data.start
    let length = this.data.courseList.length

    if (length >= 10 && !this.data.reachBottom) {
      this.setData({
        start: start + 1
      })
      this.getHotList()
    }
  },

  // 新增足迹
  recordTrack(id) {
    appRequest(addTrack, { courseId: id }, 'POST', false).then(res => { })
  },

  // 分享
  onShareAppMessage() {
    let shareUrl = `/pages/videoDetail/videoDetail?id=${this.data.pageId}`
    appRequest(addShare, {
      crouseId: this.data.pageId,
      scenecode: 1007,
      type: 1,
      coursetype: 1,
      url: shareUrl
    }, 'POST').then(res => {})

    return {
      title: this.data.videoDetail.title,
      path: shareUrl
    }
  }
})