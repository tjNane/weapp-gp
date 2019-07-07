import { getToken } from 'utils/token.js'

App({
  onLaunch: function (e) {
    // 进入小程序判断用户是否授权
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userInfo']) {
          wx.navigateTo({
            url: '/pages/author/author'
          })
          console.log('未授权')
        } else {
          wx.checkSession({
            fail() {
              getToken()
            }
          })
        }
      }
    })
  },

  globalData: {
    // 要跳转的小程序appid
    tencentCourseAppid: '',
    // 图片cdn地址
    imageCdnUrl: ''
  }
})