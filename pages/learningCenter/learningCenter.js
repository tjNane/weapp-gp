import { appRequest } from '../../utils/request.js'
import { applyCourseList, applyCourseImageList, learningCenterList, queryVipAuditByWxId, judgeFollowWeChatPublic } from '../../api/mySubject.js'
import { toTimestamp } from '../../utils/util.js'

const app = getApp()
Page({

  data: {
    // 切换tab
    tabs: [
      { id: 0, text: '最近学习' },
      { id: 1, text: '我的学籍' }
    ],
    // 当前选中的tab
    currentTab: 0,
    // 报名课程
    applyCourse: [],
    // 录播课程
    recordedCourse: [],
    // 当前时间戳
    timestamp: 0,
    // 提前30分钟打卡时间
    frontTime: 30 * 60 * 1000,
    queryVipAuditInfo: null,
    // 是否重新刷新页面
    isRefresh: 0,
    followWeChat:false
  },

  onLoad: function(options) {
    this.getLearningCenterList()
    this.getCurrentTime()
    this.getFollowWeChat()
  },

  onShow() {
    this.getQueryVipAuditByWxId()
    if (this.data.isRefresh) {
      this.onLoad()
      this.setData({
        isRefresh: 0
      })
    }
  },

  // 切换tab
  switchTab(e) {
    let index = e.currentTarget.dataset.idx
    this.setData({
      currentTab: index
    })
  },

  // 跳转申请学籍
  applyNavigator(){
    wx.navigateTo({
      url: '../applyStudent/applyStudent',
    })
  },

  getFollowWeChat(){
    appRequest(judgeFollowWeChatPublic).then(res => {
      let result = res.data
      if (result){
        this.setData({
          followWeChat:result
        })
      }
    })
  },

  // 学习中心列表
  getLearningCenterList() {
    appRequest(learningCenterList).then(res => {
      let list = res.data
      for (let v of list) {
        if (v.arrangement) {
          v.arrangement.startTimestamp = toTimestamp(v.arrangement.arrangementStartTime)
          v.arrangement.endTimestamp = toTimestamp(v.arrangement.arrangementEndTime)
          v.arrangement.startShortTime = v.arrangement.arrangementStartTime.slice(11, 16)
          v.arrangement.endShortTime = v.arrangement.arrangementEndTime.slice(11, 16)
        }
        v.courseInfo.vipTimeShort = v.courseInfo.vipTime.slice(0, 10)
      }
      this.setData({
        applyCourse: list
      })
    })
  },

  // 待审核学籍信息
  getQueryVipAuditByWxId() {
    appRequest(queryVipAuditByWxId, {}, 'GET', false).then(res => {
      this.setData({
        queryVipAuditInfo: res.data
      })
    })
  },

  // 获取当前时间戳
  getCurrentTime() {
    let timestamp = Date.parse(new Date())
    this.setData({ timestamp })
  },

  // 跳转最近学习详情
  navToCourseDetail(e) {
    let id = e.currentTarget.dataset.id
    let haveArrangement = e.currentTarget.dataset.arrangement
    let punchcard = e.currentTarget.dataset.punchcard
    let title = e.currentTarget.dataset.title
    let url = e.currentTarget.dataset.url
    let arrangement = !punchcard && haveArrangement ? 1 : 0
    wx.setStorage({
      key: 'url',
      data: url,
      success: () => {
        wx.navigateTo({
          url: `../learningDetail/learningDetail?courseId=${id}&arrangement=${arrangement}&title=${title}`
        })
      }
    })
  },

  // 老学员绑定
  bindOldStudent() {
    wx.navigateTo({
      url: '../bindWechat/bindWechat',
    })
  }
})