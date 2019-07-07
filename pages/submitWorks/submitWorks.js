import { appRequest } from '../../utils/request.js'
import { addWork } from '../../api/mySubject.js'


Page({

  data: {
    // 剪贴板的内容
    clipBoardText: '',
    // 提示文本内容
    tipsText: '',
    // 页面参数
    options: {},
    // 备注
    remark: ''
  },

  onLoad: function(options) {
    this.setData({ options })
  },

  onShow() {
    this.getSystemClip()
  },

  // 获取系统剪贴板内容
  getSystemClip() {
    wx.getClipboardData({
      success: res => {
        this.setData({
          clipBoardText: res.data
        })
        if (this.data.clipBoardText) {
          this.setData({
            tipsText: '已监测到你最近复制的链接'
          })
        } else {
          this.setData({
            tipsText: '复制你的作业链接，系统将自动检测粘贴'
          })
        }
      }
    })
  },

  // 监听输入
  watchInput(e) {
    this.setData({
      clipBoardText: e.detail.value
    })
  },

  watchTextarea(e) {
    this.setData({
      remark: e.detail.value
    })
  },

  // 提交
  confirmSubmit() {
    appRequest(addWork, {
      arrangementId: this.data.options.arrangementId,
      homeworkUrl: this.data.clipBoardText,
      homeworkContext: this.data.remark,
      vipCourseid: this.data.options.vipcourseid
    }, 'POST').then(res => {
      wx.navigateBack({
        delta: 1
      })
    })
  }
})