import { appRequest } from '../../utils/request.js'
import { punchCardInfo } from '../../api/mySubject.js'
import { addShare, getQRcode } from '../../api/my.js'

const app = getApp()
Page({

  data: {
    // 课程标题
    title: '',
    // 打卡次数
    punchLength: 0,
    // 腾讯课堂地址
    tencentCourseAppid: '',
    // 分享id
    arrangementId: 0,
    // 分享图的小程序码
    qrcodeImage: ''
  },

  onLoad: function (options) {
    this.setData({
      title: options.title,
      arrangementId: options.arrangementId
    })
    this.getPunchCardInfo(options.ids)
  },

  // 获取打卡次数
  getPunchCardInfo(id) {
    appRequest(punchCardInfo, { vipCourceId: id }).then(res => {
      this.setData({
        punchLength: res.data.length
      })
      this.createCanvas(res.data.length)
    })
  },

  // 生成分享图
  createCanvas(length) {
    appRequest(getQRcode, { path: `pages/index/index` }, 'POST').then(res => {
      this.setData({ qrcodeImage: res.data })
      wx.getImageInfo({
        src: res.data,
        success: resQRcode => {
          let qrcode = resQRcode.path
          wx.getImageInfo({
            src: wx.getStorageSync('userInfo').avatarUrl,
            success: res => {
              const ctx = wx.createCanvasContext('canvas')
              // 白色背景
              ctx.rect(0, 0, 276, 436)
              ctx.setFillStyle('white')
              ctx.fill()

              // 顶部大图
              ctx.drawImage('../../images/modal-img1.png', 0, 0, 276, 189)
              // 头像
              ctx.save()
              ctx.beginPath()
              ctx.arc(138, 228, 21, 0, Math.PI * 2, false)
              ctx.fill()
              ctx.clip()
              ctx.drawImage(res.path, 117, 207, 42, 42)
              ctx.restore()

              // 描述文字
              ctx.setFillStyle('#666666')
              ctx.setFontSize(14)
              ctx.setTextAlign('center')
              ctx.fillText('我正在demo学习', 138, 270)

              ctx.setFillStyle('#252525')
              ctx.setTextAlign('center')
              let courseTitle = this.data.title
              if (courseTitle.length > 20) {
                courseTitle = courseTitle.slice(0, 20) + '...'
              }
              ctx.fillText(courseTitle, 138, 300)

              ctx.setFillStyle('#FEE9E5')
              ctx.fillRect(63, 314, 150, 24)

              ctx.setFillStyle('#FD553A')
              ctx.setTextAlign('center')
              ctx.setFontSize(13)
              ctx.fillText('打卡' + length + 1 + '次', 138, 330)

              // 小程序码
              // ctx.save()
              // ctx.beginPath()
              // ctx.arc(41, 391, 21, 0, Math.PI * 2, false)
              // ctx.fill()
              // ctx.clip()
              ctx.drawImage(qrcode, 20, 370, 42, 42)
              // ctx.restore()

              ctx.setFillStyle('#999999')
              ctx.setFontSize(14)
              ctx.fillText('长按小程序码查看详情', 150, 396)
              ctx.draw()
            }
          })
        }
      })
    })
    
    
  },

  // 保存海报图片
  savePoster() {
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 276,
      height: 436,
      canvasId: 'canvas',
      success: res => {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: data => {
            wx.showToast({
              title: '保存成功',
            })
          }
        })
      }
    })
  },

  // 跳转腾讯课堂
  goTencent() {
    wx.navigateToMiniProgram({
      appId: app.globalData.tencentCourseAppid,
      path: wx.getStorageSync('url')
    })
  },
  
  // 页面卸载
  onUnload() {
    wx.removeStorageSync('tencentUrl')
  },

  // 分享
  onShareAppMessage() {
    appRequest(addShare, {
      crouseId: this.data.arrangementId,
      scenecode: 1007,
      type: 1,
      coursetype: 2,
      url: '/pages/shareClock/shareClock'
    }, 'POST').then(res => { })
    return {
      title: '快来一起学习吧~',
      path: '/pages/index/index'
    }
  }
})