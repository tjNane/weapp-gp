import { appRequest } from '../../utils/request.js'
import { shareList } from '../../api/my.js'

Page({

  data: {
    // 分享列表
    shareList: [],
    // 页码
    start: 1,
    // 分页长度
    length: 10,
    // 是否触底了
    reachBottom: false,
    // 总分享数
    total: 0
  },

  onLoad: function(options) {
    this.getShareList()
  },

  // 获取分享列表
  getShareList() {
    let page = this.data.start
    let pageSize = this.data.length

    appRequest(shareList, { page, pageSize }, 'POST').then(res => {
      console.log(res)
      this.setData({ total: res.data.total })
      if (res.data.list.length) {
        let list = this.data.shareList
        list.push(...res.data.list)
        this.setData({ shareList: list })
        if (this.data.shareList.length % 10 != 0) {
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
    let length = this.data.shareList.length

    if (length >= 10 && !this.data.reachBottom) {
      this.setData({
        start: start + 1
      })
      this.getShareList()
    }
  }
})