import { appRequest } from '../../utils/request.js'
import { hotList, discountList, guessLikeList } from '../../api/goodCourse.js'
import { myTrack } from '../../api/my.js'

Page({

  data: {
    // 页面类型 1-爆款推荐 2-折扣专区 3-猜你喜欢
    pageType: 0,
    // 页面标题
    pageTitle: '',
    // 爆款推荐列表
    courseList: [],
    // 页码
    start: 1,
    // 分页长度
    length: 10,
    // 是否触底了
    reachBottom: false
  },

  onLoad: function (options) {
    const pageType = options.type
    this.setData({ pageType })
    let title = ''
    // 动态设置页面标题
    switch (pageType) {
      case '1':
        title = '爆款推荐'
        break;
      case '2':
        title = '折扣专区'
        break;
      case '3':
        title = '猜你喜欢'
        break;
      default:
        console.log('暂无匹配页面')
    }
    wx.setNavigationBarTitle({ title })
    this.setData({ pageTitle: title })
    this.getHotList()
  },

  // 获取课程列表
  getHotList() {
    let pageNo = this.data.start
    let pageSize = this.data.length
    let api = ''

    if (this.data.pageType == '1') {
      api = hotList
    } else if (this.data.pageType == '2') {
      api = discountList
    } else if (this.data.pageType == '3') {
      api = guessLikeList
    }
  
    appRequest(api, { pageNo, pageSize }).then(res => {
      if (res.data.length) {
        let list = this.data.courseList
        list.push(...res.data)
        this.setData({ courseList: list })
        if (this.data.courseList.length % 10 != 0) {
          this.setData({ reachBottom: true })
        }
      } else {
        this.setData({ reachBottom: true })
      }
    })
  },

  // 触底加载更多数据
  onReachBottom() {
    let start = this.data.start
    let length = this.data.courseList.length

    if (length >= 10 && !this.data.reachBottom) {
      this.setData({
        start: start + 1
      })
      this.getHotList()
    }
  },

  // 分享
  onShareAppMessage() {
    return {
      title: this.data.pageTitle,
      path: `/pages/hotCourse/hotCourse?type=${this.data.pageType}`
    }
  }
})