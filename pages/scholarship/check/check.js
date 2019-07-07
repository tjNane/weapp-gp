import { appRequest } from '../../../utils/request.js'
import { queryResumeInfo, intentionCompany, failReapply } from '../../../api/scholarship.js'

Page({

  data: {
    // 简历详情
    resumeDetail: {},
    // 意向公司
    intentionList: [],
    // 状态文字
    checkText: '',
    // 是否返回2级
    isBackTwo: false
  },

  onReady() {
    this.tips = this.selectComponent("#tips")
  },

  onLoad: function (options) {
    this.queryHaveResume()
    this.getIntentionCompany()

    if (options.isBackTwo) {
      this.setData({ isBackTwo: true })
    }
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
        if (ele.status == 5) {
          haveSuccessInter++
        }
      })
      if (haveSuccessInter == resData.length) {
        this.tips.openModal()
        this.setData({
          checkText: '审核未通过'
        })
      } else {
        this.setData({
          checkText: '正在审核中...'
        })
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

  // 页面卸载
  onUnload() {
    if (this.data.isBackTwo) {
      wx.navigateBack({
        delta: 2
      })
    }
  }
})