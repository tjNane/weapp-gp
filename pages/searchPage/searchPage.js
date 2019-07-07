import { appRequest } from '../../utils/request.js'
import { searchResult, hotSearch } from '../../api/goodCourse.js'

Page({

  data: {
    // 搜索value
    searchValue: '',
    // 热搜课程
    hotCourse: [],
    // 搜索结果 1-默认 2-有结果 3-无结果
    resultStatus: 1,
    // 相关课程
    relativeCourse: [],
    // 相关课程总数
    relativeLength: 0,
    // 往期录播
    previous: [],
    // 往期录播总数
    previousLength: 0,
    // 历史记录
    historyList: []
  },

  onLoad: function (options) {
    let history = wx.getStorageSync('searchHistory')
    if (history) {
      this.setData({
        historyList: history
      })
    }
    this.getHotSearchList()
  },

  // 返回首页
  backToHome() {
    wx.navigateBack({
      delta: 1
    })
  },

  // 获取热搜关键字列表
  getHotSearchList() {
    appRequest(hotSearch).then(res => {
      this.setData({
        hotCourse: res.data.rows
      })
    })
  },

  // 监听搜索
  watchInput(e) {
    this.setData({
      searchValue: e.detail.value.replace(/\s+/g, '')
    })
    if (!e.detail.value) {
      this.setData({
        resultStatus: 1,
        relativeCourse: [],
        previous: [],
        relativeLength: 0,
        previousLength: 0
      })
    }
  },

  // 确认搜索
  confirmSearch() {
    let value = this.data.searchValue
    if (value) {
      appRequest(searchResult, { value }).then(res => {
        let relativeLength = res.data.courseist.total
        let previousLength = res.data.previousList.total
        this.setData({
          relativeCourse: res.data.courseist.rows,
          previous: res.data.previousList.rows,
          relativeLength,
          previousLength
        })
        if (relativeLength || previousLength) {
          this.setData({
            resultStatus: 2
          })
        } else {
          this.setData({
            resultStatus: 3
          })
        }
        this.setSearchHistory()
      })
    } else {
      wx.showToast({
        title: '请输入搜索关键字',
        icon: 'none'
      })
    }
  },

  // 存搜索历史
  setSearchHistory() {
    if (wx.getStorageSync('searchHistory')) {
      let historyList = wx.getStorageSync('searchHistory')
      // 本地最多只保留10条历史记录
      historyList.length >= 10 && historyList.pop()
      historyList.unshift(this.data.searchValue)
      // 去重
      let setHistoryList = [...new Set(historyList)]
      wx.setStorageSync('searchHistory', setHistoryList)
    } else {
      wx.setStorageSync('searchHistory', [this.data.searchValue])
    }
  },

  // 按搜索历史搜索
  chooseHistory(e) {
    let value = e.currentTarget.dataset.value
    this.setData({ searchValue: value })
    this.confirmSearch()
  },

  // 删除历史记录
  clearHistory() {
    wx.showModal({
      title: '清除历史',
      content: '确定要清除历史记录吗',
      confirmColor: '#FD553A',
      success: res => {
        if (res.confirm) {
          wx.removeStorage({
            key: 'searchHistory',
            success: () => {
              wx.showToast({
                title: '清除成功'
              })
              this.setData({ historyList: [] })
            }
          })
        }
      }
    })
  }
})