import { appRequest, baseUrl } from '../../utils/request.js'
import { bindOld } from '../../api/learningCenter.js'
Page({

  data: {
    // 国家区号
    currentAreaCode: 0,
    areaCode: [{
      name: '中国',
      code: '+86'
    }, {
      name: '美国',
      code: '+1'
    }, {
      name: '中国香港',
      code: '+852'
    }, {
      name: '中国台湾',
      code: '+886'
    }, {
      name: '日本',
      code: '+81'
    }, {
      name: '澳大利亚',
      code: '+61'
    }, {
      name: '新加坡',
      code: '+65'
    }, {
      name: '韩国',
      code: '+82'
    }, {
      name: '马来西亚',
      code: '+60'
    }, {
      name: '加拿大',
      code: '+1'
    }, {
      name: '英国',
      code: '+44'
    }, {
      name: '其他',
      code: ''
    }],
    // qq号
    qqNumber: '',
    // 手机号
    telNumber: ''
  },

  onLoad: function (options) {

  },

  // QQ输入
  watchQQ(e) {
    this.setData({
      qqNumber: e.detail.value
    })
  },

  // 手机号输入
  watchTel(e) {
    this.setData({
      telNumber: e.detail.value
    })
  },

  // 选择国家
  selectCountry(e) {
    this.setData({
      currentAreaCode: e.detail.value
    })
  },

  // 提交表单
  submitForm() {
    // QQ号验证
    let regQQ = /^\s*[.0-9]{5,11}\s*$/
    // 手机号验证
    let regTell = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;

    if (!regQQ.test(this.data.qqNumber)) {
      wx.showToast({ title: 'QQ号有误', icon: 'none' })
      return
    }
    if (!regTell.test(this.data.telNumber)) {
      wx.showToast({ title: '手机号码有误', icon: 'none' })
      return
    }

    let form = {
      vipQq: this.data.qqNumber,
      vipTel: this.data.areaCode[this.data.currentAreaCode].code + this.data.telNumber
    }

    wx.request({
      url: baseUrl + bindOld,
      data: form,
      header: { token: wx.getStorageSync('token') },
      method: 'POST',
      success: function (res) {
        if (res.statusCode == 200 && res.data.success) {
          wx.showModal({
            title: '提示',
            content: '恭喜您成功绑定学籍信息',
            confirmColor: '#FD553A',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.reLaunch({
                  url: '../learningCenter/learningCenter',
                })
              }
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '未解绑或信息错误，请联系您的助教老师核对',
            confirmColor: '#FD553A',
            showCancel: false
          })
        }
      },
      fail: function (e) {
        wx.hideLoading()
        reject(e)
      }
    })
  }
})