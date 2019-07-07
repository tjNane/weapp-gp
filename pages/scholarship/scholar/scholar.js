import { appRequest } from '../../../utils/request.js'
import { scholarDetail, reApply } from '../../../api/scholarship.js'

Page({

  data: {
    applyResume: {},
    applyScholarship: {},
    company: {},
    position: {},
    scholarship: {},
    // 公司面试状态
    companyStatus: '',
    companyStatusText: '',
    // 是否返回3级
    isBackTwo: false
  },

  onLoad: function (options) {
    this.getScholarDetail()

    if (options.isBackTwo) {
      this.setData({ isBackTwo: true })
    }
  },

  // 页面卸载
  onUnload() {
    if (this.data.isBackTwo) {
      wx.navigateBack({
        delta: 2
      })
    }
  },

  // 获取奖学金详情
  getScholarDetail() {
    appRequest(scholarDetail, {}, 'POST').then(res => {
      let resData = res.data
      // offer图片
      let offerurl = resData.applyScholarship.offerurl
      if (offerurl.indexOf(',') != -1) {
        resData.applyScholarship.offerurlArr = resData.applyScholarship.offerurl.split(',')
      } else {
        resData.applyScholarship.offerurlArr = [offerurl]
      }

      // 公司面试状态
      let companyStatus = resData.intentionCompany.status
      if (companyStatus == 0) {
        this.setData({ companyStatusText: '审核中' })
      } else if (companyStatus == 1) {
        this.setData({ companyStatusText: '审核通过' })
      } else if (companyStatus == 2) {
        this.setData({ companyStatusText: '发送面试邀请' })
      } else if (companyStatus == 3) {
        this.setData({ companyStatusText: '面试成功' })
      } else if (companyStatus == 4) {
        this.setData({ companyStatusText: '面试失败' })
      } else if (companyStatus == 5) {
        this.setData({ companyStatusText: '审核失败' })
      }
      this.setData({ companyStatus })

      this.setData({
        applyResume: resData.applyResume,
        applyScholarship: resData.applyScholarship,
        company: resData.company,
        position: resData.position,
        scholarship: resData.scholarship
      })
    })
  },

  // 重新申请
  reApply() {
    let applyScholarshipId = this.data.applyScholarship.id
    appRequest(reApply, { id: applyScholarshipId }, 'POST').then(res => {
      wx.navigateTo({
        url: '../receive1/receive1',
      })
    })
  },

  // 预览图片
  previewImg(e) {
    wx.previewImage({
      current: e.currentTarget.dataset.url,
      urls: this.data.applyScholarship.offerurlArr
    })
  }
})

// 奖学金status
// 1 审核中  2审核成功 3 失败

// 公司审核状态status
// 0：审核中，1：审核通过，2：发送面试邀请，3：面试成功，4：面试失败, 5:审核失败