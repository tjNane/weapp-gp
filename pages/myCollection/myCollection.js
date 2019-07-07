import { appRequest } from '../../utils/request.js'
import { collectionList } from '../../api/my.js'

Page({

  data: {
    myCollectionList: [],
    // 页码
    start: 1,
    // 分页长度
    length: 10,
    // 是否触底了
    reachBottom: false,
    // 收藏总数
    total: 0
  },

  onLoad: function (options) {
    this.getCollectionList()
  },

  // 获取收藏列表
  getCollectionList() {
    let page = this.data.start
    let pageSize = this.data.length

    appRequest(collectionList, { page, pageSize }, 'POST').then(res => {
      this.setData({ total: res.data.total })
      if (res.data.list.length) {
        let list = this.data.myCollectionList
        list.push(...res.data.list)
        this.setData({ myCollectionList: list })
        if (this.data.myCollectionList.length % 10 != 0) {
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
    let length = this.data.myCollectionList.length

    if (length >= 10 && !this.data.reachBottom) {
      this.setData({
        start: start + 1
      })
      this.getCollectionList()
    }
  }
})