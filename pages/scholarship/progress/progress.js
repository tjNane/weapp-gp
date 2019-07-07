import { appRequest } from '../../../utils/request.js'
import { queryResumeInfo, intentionCompany, failReapply } from '../../../api/scholarship.js'

Page({

  data: {
    // 意向公司
    intentionList: [],
    // 简历详情
    resumeDetail: {},
    // 是否有面试成功的公司
    canNav: false
  },

  onLoad: function (options) {
    this.queryHaveResume()
    this.getIntentionCompany()
  },

  // 查询简历
  queryHaveResume() {
    appRequest(queryResumeInfo).then(res => {
      let resData = res.data
      wx.downloadFile({
        url: resData.resumeUrl,
        success: downloadRes => {
          const filePath = downloadRes.tempFilePath
          wx.getFileInfo({
            filePath,
            success: getRes => {
              resData.size = `${(getRes.size / 1024 / 1024).toFixed(2)}MB`
              this.setData({
                resumeDetail: resData
              })
            },
            fail: getRes => {
              console.log(getRes)
            }
          })
        }
      })
    })
  },

  // 获取意向公司
  getIntentionCompany() {
    appRequest(intentionCompany, { offset: 0, limit: 3 }).then(res => {
      let resData = res.data.rows
      let haveSuccessInter = 0
      resData.forEach(ele => {
        if (ele.status == 0) {
          ele.statusText = '公司正在审核中'
        } else if (ele.status == 1) {
          ele.statusText = '已通过简历审核，请保持电话通畅，等待HR与你联系'
        } else if (ele.status == 2) {
          ele.statusText = '发送面试邀请'
        } else if (ele.status == 3) {
          ele.statusText = '恭喜你面试成功，赶快领取奖学金吧'
        } else if (ele.status == 4) {
          ele.statusText = '面试失败'
        } else if (ele.status == 5) {
          ele.statusText = '简历审核失败'
        }
        ele.utime = ele.utime.slice(0, 10)
        // 是否有面试成功公司
        if (ele.status == 3) {
          haveSuccessInter++
        }
      })
      if (haveSuccessInter > 0) {
        this.setData({ canNav: true })
      }
      this.setData({
        intentionList: resData
      })
    })
  },

  // 重新申请
  goApply() {
    appRequest(failReapply, { id: this.data.resumeDetail.id }).then(res => {
      wx.navigateTo({
        url: '../apply/apply'
      })
    })
  },

  // 领取奖学金
  fetchScholarship() {
    if (!this.data.canNav) {
      wx.showToast({
        title: '暂无面试成功公司',
        icon: 'none'
      })
      return
    }
    wx.navigateTo({
      url: '../receive1/receive1',
    })
  }
})