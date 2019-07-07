import { appRequest } from '../../utils/request.js'
import { personalNumber } from '../../api/my.js'
import { getUpdateStatus, updateStatus } from '../../api/scholarship.js'

Page({

  data: {
    // 头像
    userPhoto: '',
    // 昵称
    userName: '',
    // 个人数据
    personalNumber: {},
    // 是否显示奖学金更新进度
    isChange: false,
    // 奖学金进度
    scholarStatus: '',
    // 奖学金进度描述
    scholarStatusText: ''
  },

  onLoad: function (options) {
    this.getUserInfomation()
  },

  onShow() {
    this.getUserStatistics()
    this.getScholarStatus()
  },

  // 获取个人信息
  getUserInfomation() {
    this.setData({
      userPhoto: wx.getStorageSync('userInfo').avatarUrl,
      userName: wx.getStorageSync('userInfo').nickName
    })
  },
  
  // 获取个人统计信息
  getUserStatistics() {
    appRequest(personalNumber, {}, 'GET', false).then(res => {
      this.setData({
        personalNumber: res.data
      })
    })
  },

  // 分享
  onShareAppMessage() {
    return {
      title: '发现好课',
      path: '/pages/index/index'
    }
  },

  // 获取奖学金状态
  getScholarStatus() {
    appRequest(getUpdateStatus, {}, 'GET', false).then(res => {
      let resData = JSON.parse(res.data)
      if (!resData) return
      if (resData.isChange) {
        this.setData({ isChange: true })
      } else {
        this.setData({ isChange: false })
      }

      if (resData.status == 1) {
        this.setData({ scholarStatusText: '简历审核中' })
      } else if (resData.status == 2) {
        this.setData({ scholarStatusText: '简历审核结果' })
      } else if (resData.status == 3) {
        this.setData({ scholarStatusText: '已申请奖学金' })
      } else if (resData.status == 4) {
        this.setData({ scholarStatusText: '申请奖学金结果' })
      }
      this.setData({
        scholarStatus: resData.status
      })
    })
  },

  // 跳转奖学金页面
  toScholar() {
    if (this.data.isChange) {
      appRequest(updateStatus, {}, 'POST', false).then(res => {
        console.log(res)
      })
    }
    let status = this.data.scholarStatus
    if (status == 1) {
      wx.navigateTo({
        url: '../scholarship/check/check'
      })
    } else if (status == 2) {
      wx.navigateTo({
        url: '../scholarship/progress/progress'
      })
    } else if (status == 3 || status == 4) {
      wx.navigateTo({
        url: '../scholarship/scholar/scholar'
      })
    } else {
      wx.navigateTo({
        url: '../scholarship/apply/apply'
      })
    }
  }
})