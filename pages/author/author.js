import { baseUrl } from '../../utils/request.js'
import { getRandom } from '../../utils/util.js'

Page({

  getUserInfo(e) {
    wx.getSetting({
      success: res => {
        // 是否授权
        if (res.authSetting['scope.userInfo']) {
          // 获取token
          wx.request({
            url: baseUrl + '/token/init',
            data: { imei: getRandom(6) },
            success: tokenRes => {
              if (tokenRes.statusCode == 200) {
                console.log('得到token为')
                console.log(tokenRes)
                var token = tokenRes.data.data.token
                // 登录后存储token和个人信息
                wx.login({
                  success: loginRes => {
                    if (loginRes.code) {
                      wx.request({
                        url: baseUrl + '/wxuser/wxLogin',
                        header: { token },
                        data: { code: loginRes.code },
                        method: 'POST',
                        success: data => {
                          wx.setStorageSync('userInfo', e.detail.userInfo)
                          wx.setStorage({
                            key: 'token',
                            data: token,
                            success: () => {
                              // wx.reLaunch({
                              //   url: '../index/index',
                              //   success: () => {
                              //     wx.hideLoading()
                              //   }
                              // })
                              this.gotoPrevPage()
                            }
                          })
                        }
                      })
                    }
                  }
                })
              }
            }
          })
        } else {
          wx.navigateTo({
            url: '../author/author',
          })
        }
      }
    })
  },

  // 返回上个页面并刷新
  gotoPrevPage() {
    let pages = getCurrentPages()
    let currPage = null //当前页面
    let prevPage = null //上一个页面

    if (pages.length >= 2) {
      currPage = pages[pages.length - 1] //当前页面
      prevPage = pages[pages.length - 2] //上一个页面
    }
    if (prevPage) {
      prevPage.setData({
        isRefresh: 1
      })
    }

    wx.navigateBack({
      delta: 1
    })
  }

})
