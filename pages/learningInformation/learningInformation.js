import {
  appRequest
} from '../../utils/request.js'
import {
  subjectInfo
} from '../../api/learningCenter.js'

Page({

  /** 
   * 页面的初始数据 
   */
  data: {
    subject: {},
    userPhoto: '',
    subjectImg: '',
    vipCourceId:''
  },

  /** 
   * 生命周期函数--监听页面加载 
   */
  onLoad: function(options) {
    this.setData({
      subjectImg: options.subjectImg,
      vipCourceId: options.vipCourceId
    })
    this.getUserInfomation()
    this.getSubjectInfo()
  },

  // 获取个人信息
  getUserInfomation() {
    this.setData({
      userPhoto: wx.getStorageSync('userInfo').avatarUrl
    })
  },

  // 获取学科详情
  getSubjectInfo() {
    var wxid = 'onLBD0hWZsd_aMm4Yt8c6y308-7I'
    let vipCourceId = this.data.vipCourceId
    appRequest(subjectInfo, {
      vipWxid:wxid,vipCourceId
    }).then(res => {
      if (res.success) {
        this.setData({
          subject: res.data
        });
      }
    })
  },

  // 跳转入学手册
  enterSchool() {
    wx.navigateTo({
      url: `../enterSchool/enterSchool?id=${this.data.vipCourceId}`
    })
  },

  // 跳转学员协议
  enterProtocol() {
    wx.navigateTo({
      url: `../schoolProtocol/schoolProtocol?id=${this.data.vipCourceId}`
    })
  }
})