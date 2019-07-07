import { appRequest } from '../../utils/request.js'
import { myTrack } from '../../api/my.js'

Page({

  data: {
    // 足迹列表
    trackList: [],
    // 页码
    start: 1,
    // 分页长度
    length: 10,
    // 是否触底了
    reachBottom: false,
    // 所有足迹长度
    total: 0
  },

  onLoad: function (options) {
    this.getTrackList()
  },

  // 获取课程列表
  getTrackList() {
    let pageNo = this.data.start
    let pageSize = this.data.length

    appRequest(myTrack, { pageNo, pageSize }, 'POST').then(res => {
      console.log(res)
      this.setData({ total: res.data.total })
      if (res.data.list.length) {
        let list = this.data.trackList
        list.push(...res.data.list)
        this.setData({ trackList: list })
        if (this.data.trackList.length % 10 != 0) {
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
    let length = this.data.trackList.length

    if (length >= 10 && !this.data.reachBottom) {
      this.setData({
        start: start + 1
      })
      this.getTrackList()
    }
  }
})