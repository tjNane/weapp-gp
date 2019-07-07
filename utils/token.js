import { baseUrl } from 'request.js'
import { getRandom } from 'util.js'

/**
 * 获取Token
 * token -> 登录得到code -> 若已授权则获取用户信息（未授权跳转到授权页）
 */
export function getToken(callback) {
  wx.request({
    url: baseUrl + '/token/init',
    data: { imei: getRandom(6) },
    success: res => {
      if (res.statusCode == 200) {
        var token = res.data.data.token

        // 登录
        wx.login({
          success: loginRes => {
            if (loginRes.code) {
              console.log(loginRes.code)
              wx.setStorageSync('token', token)
              wx.setStorage({
                key: 'token',
                data: token,
                success: () => {
                  callback && callback()
                }
              })
              // 获取个人信息
              wx.getUserInfo({
                success: result => {
                  wx.setStorageSync('userInfo', result.userInfo)
                  wx.request({
                    url: baseUrl + '/wxuser/wxLogin',
                    header: { token },
                    method: 'POST',
                    data: { code: loginRes.code },
                    success: userRes => {
                      console.log(userRes)
                    }
                  })
                }
              })
            } else {
              console.log('登录失败！' + res.errMsg)
            }
          }
        })
      }
    },
    fail: function (e) {
      console.log(e)
    }
  })
}