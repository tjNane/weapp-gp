import { getToken } from 'token.js'

// 请求基础路径
export const baseUrl = ''

/**
 * 统一的网络请求
 * @param { string } api 请求地址
 * @param { object } params 请求携带参数
 * @param { string } method 请求方法
 * @param { boolean } loading 是否显示loading
 */
export function appRequest(api, params = {}, method = 'GET', loading = true) {
  return new Promise((resolve, reject) => {
    if (wx.getStorageSync('token')) {
      // 有token，直接请求
      request(api, params, method, loading, resolve, reject)
    } else {
      // 无token，去获取完token再请求
      getToken(() => {
        request(api, params, method, loading, resolve, reject)
      })
    }
  })
}

function request(api, params, method, loading, resolve, reject) {
  if (loading) {
    wx.showLoading({ title: '加载中' })
  }
  wx.request({
    url: baseUrl + api,
    data: params,
    header: { token: wx.getStorageSync('token') },
    method: method,
    success: function (res) {
      if (res.data.code == '3') {
        // token失效
        getToken(() => {
          request(api, params, method, loading, resolve, reject)
        })
        wx.hideLoading()
        return
      }
      if (res.statusCode == 200 && res.data.success) {
        loading && wx.hideLoading()
        resolve(res.data)
      } else {
        loading && wx.hideLoading()
        console.log('请求失败' + res.data.message)
      }
    },
    fail: function (e) {
      wx.hideLoading()
      reject(e)
    }
  })
}