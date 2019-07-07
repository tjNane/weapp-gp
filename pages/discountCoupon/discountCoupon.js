import { appRequest } from '../../utils/request.js'
import { discountList } from '../../api/my.js'

const app = getApp()
Page({

  data: {
    // 切换tab
    tabs: [
      { id: 0, text: '未使用' },
      { id: 1, text: '已使用' },
      { id: 2, text: '已过期' }
    ],
    // 当前选中的tab
    currentTab: 0,
    // 待使用列表
    tobeusedList: [],
    // 已使用列表
    usedList: [],
    // 已过期列表
    expiredList: []
  },

  onLoad: function (options) {
    this.getDiscountList()
    this.setData({
      imgUrl: app.globalData.imageCdnUrl
    })
  },

  // 切换tab
  switchTab(e) {
    let index = e.currentTarget.dataset.idx
    this.setData({
      currentTab: index
    })
  },

  // 获取优惠券列表
  getDiscountList() {
    appRequest(discountList).then(res => {
      this.setData({
        usedList: res.data.usedList,
        expiredList: res.data.expiredList,
        tobeusedList: res.data.tobeusedList
      })
    })
  }
})