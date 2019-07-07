import { appRequest } from '../../utils/request.js'
import { courseDetail, courseList } from '../../api/goodCourse.js'
import { isCollect, collectCourse, cancelCollectCourse, addTrack, addShare, getQRcode } from '../../api/my.js'
const WxParse = require('../../utils/wxParse/wxParse.js')
const app = getApp()

Page({

  data: {
    // 页面id
    pageId: '',
    // 本页是否收藏
    collected: false,
    // 是否显示原价
    showOriginPrice: false,
    // 切换tab
    tabs: [
      { id: 0, text: '课程介绍' },
      { id: 1, text: '课程大纲' },
      { id: 2, text: '相关课程' }
    ],
    // 当前选中的tab
    currentTab: 0,
    // tab是否固定
    fixedNav: false,
    // 课程介绍
    courseIntrodution: {},
    // 全部老师介绍列表
    teacherList: [],
    // 展示中老师列表
    partTeacherList: [],
    // 是否查看全部老师
    isCheakAll: false,
    // 课程大纲
    courseOutline: [],
    // 大纲当前展开
    currentSlide: 0,
    // 热门课程
    hotList: [],
    // 折扣课程
    discountList: [],
    // 是否加载过了相关课程
    loadedRelativeCourse: false,
    // 跳转腾讯课堂地址
    tencentCorseUrl: '',
    // 分享图片
    shareImage: '',
    // 分享图的小程序码
    qrcodeImage: '',
    // 是否重新刷新页面
    isRefresh: 0
  },

  onLoad: function (options) {
    let pageId = options.id
    this.setData({ pageId })
    this.getCourseDetail(pageId)
    this.isCollectCourse(pageId)
    this.recordTrack(pageId)
    if (options.type) {
      this.setData({ showOriginPrice: true })
    }
  },

  onShow() {
    if (this.data.isRefresh) {
      let pageId = this.data.pageId
      this.setData({ pageId })
      this.getCourseDetail(pageId)
      this.isCollectCourse(pageId)
      this.recordTrack(pageId)
      this.setData({ isRefresh: 0 })
    }
  },

  onReady() {
    // 获得弹窗组件
    this.popup = this.selectComponent("#pop")
  },

  // 切换tab
  switchTab(e) {
    let index = e.currentTarget.dataset.idx
    this.setData({ currentTab: index })
    if (index == '2' && !this.data.loadedRelativeCourse) {
      this.getRelativeCourse()
      this.setData({ loadedRelativeCourse: true })
    }
  },

  // 监听页面滚动
  // onPageScroll(e) {
  //   let topDistance = e.scrollTop
  //   if (topDistance >= 200) {
  //     this.setData({ fixedNav: true })
  //   } else {
  //     this.setData({ fixedNav: false })
  //   }
  // },

  // 课程大纲收缩展开
  toggleSlide(e) {
    let index = e.currentTarget.dataset.idx
    this.setData({ currentSlide: index })
  },

  // 打开弹窗
  showPopUp() {
    this.createCanvas()
    this.popup.showPopUp()
  },

  // 生成分享图
  createCanvas() {
    appRequest(getQRcode, { path: `pages/courseDetail/courseDetail?id=${this.data.pageId}` }, 'POST').then(res => {
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
              ctx.rect(0, 0, 210, 300)
              ctx.setFillStyle('white')
              ctx.fill()
              // 头像
              ctx.save()
              ctx.beginPath()
              ctx.arc(28, 28, 16, 0, Math.PI * 2, false)
              ctx.fill()
              ctx.clip()
              ctx.drawImage(res.path, 12, 12, 32, 32)
              ctx.restore()

              // 描述文字
              ctx.setFillStyle('#252525')
              ctx.setFontSize(12)
              ctx.fillText(wx.getStorageSync('userInfo').nickName, 56, 32)

              ctx.setFontSize(14)
              let courseTitle = this.data.courseIntrodution.title
              if (courseTitle.length > 13) {
                courseTitle = courseTitle.slice(0, 13) + '...'
              }
              ctx.fillText(courseTitle, 12, 72)

              // 热度图标
              ctx.drawImage('../../images/learned.png', 12, 84, 8, 8)
              // 热度数值
              ctx.setFillStyle('#666666')
              ctx.setFontSize(10)
              ctx.fillText(this.data.courseIntrodution.hot, 24, 92)

              // 详情图片
              ctx.drawImage(this.data.shareImage, 12, 110, 186, 104)

              // 小程序码和提示文字
              // ctx.save()
              // ctx.beginPath()
              // ctx.arc(28, 266, 16, 0, Math.PI * 2, false)
              // ctx.fill()
              // ctx.clip()
              // ctx.restore()
              ctx.drawImage(qrcode, 12, 250, 32, 32)

              ctx.setFillStyle('#999999')
              ctx.setFontSize(14)
              ctx.fillText('长按小程序码查看详情', 52, 270)

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
      width: 210,
      height: 340,
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

  // 获取课程详情
  getCourseDetail(id) {
    appRequest(courseDetail, { id }).then(res => {
      let teacherList = res.data.courseDO.techerList
      if (res.data.courseDO.courseDetailDO) {
        let detail = res.data.courseDO.courseDetailDO.detail
        // 富文本转换
        WxParse.wxParse('article', 'html', detail, this, 0)
      }
      wx.getImageInfo({
        src: res.data.courseDO.picurl,
        success: res => {
          this.setData({
            shareImage: res.path
          })
        }
      })
      this.setData({
        courseIntrodution: res.data.courseDO,
        teacherList,
        tencentCorseUrl: res.data.courseDO.courseurl,
      })
      if (teacherList.length > 2) {
        this.setData({
          partTeacherList: teacherList.slice(0, 2)
        })
      } else {
        this.setData({
          partTeacherList: teacherList,
          isCheakAll: true
        })
      }
      let courseOutline = res.data.courseArrangementList
      // 直播中的课程默认展开
      courseOutline.forEach((v, index) => {
        if (v.childList) {
          for (let item of v.childList) {
            if (item.id == this.data.pageId) {
              this.setData({ currentSlide: index })
            }
          }
        }
      })
      this.setData({ courseOutline })
    })
  },

  // 查看所有老师
  checkAllTeacher() {
    this.setData({
      isCheakAll: true,
      partTeacherList: this.data.teacherList
    })
  },

  // 获取相关课程
  getRelativeCourse() {
    appRequest(courseList).then(res => {
      this.setData({
        hotList: res.data.hotList,
        discountList: res.data.discountList
      })
    })
  },

  // 收藏课程
  toggleCollect() {
    let courseId = +this.data.pageId
    if (this.data.collected) {
      appRequest(cancelCollectCourse, { courseId }, 'GET', false).then(res => {
        this.setData({ collected: false })
        wx.showToast({
          title: '取消收藏成功'
        })
      })
    } else {
      appRequest(collectCourse, { courseId }, 'POST', false).then(res => {
        this.setData({ collected: true })
        wx.showToast({
          title: '收藏成功'
        })
      })
    }
  },

  // 本课程是否收藏
  isCollectCourse(id) {
    appRequest(isCollect, { courseId: id }).then(res => {
      this.setData({ collected: res.data })
    })
  },

  touchStart() {},

  // 新增足迹
  recordTrack(id) {
    appRequest(addTrack, { courseId: id }, 'POST', false).then(res => {})
  },

  // 跳转腾讯课堂
  goTencent() {
    wx.navigateToMiniProgram({
      appId: app.globalData.tencentCourseAppid,
      path: this.data.tencentCorseUrl
    })
  },

  // 分享
  onShareAppMessage() {
    let shareUrl = `/pages/courseDetail/courseDetail?id=${this.data.pageId}`
    appRequest(addShare,
    { 
      crouseId: this.data.pageId,
      scenecode: 1007,
      type: 1,
      coursetype: 1,
      url: shareUrl  }, 'POST').then(res => {
    })
    return {
      title: this.data.courseIntrodution.title,
      path: shareUrl
    }
  }
})