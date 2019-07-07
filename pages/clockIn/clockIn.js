import { getWeeks, getCurrentMonthDay } from '../../utils/util.js'
import { appRequest } from '../../utils/request.js'
import { punchCardInfo } from '../../api/mySubject.js'
import { toTimestamp } from '../../utils/util.js'

Page({

  data: {
    // 当前显示年份
    currentYear: '',
    // 当前显示月份
    currentMonth: '',
    // 星期数字
    weekNumber: ['日', '一', '二', '三', '四', '五', '六'],
    // 当月日期
    dateArr: [],
    // 整个日历
    totalCalc: [],
    // 上个月显示天数
    frontDay: [],
    // 下个月显示天数
    backDay: [],
    // 已打卡列表
    havePunchList: [],
    // 是否显示下个月按钮
    showPreviousBtn: false,
    // 当月共打卡次数
    currentMonthPunch: 0
  },

  onLoad: function (options) {
    this.getCurrentDate()
    this.getCurrentMonthNumber()
    this.getFullCalcNumber()
    this.getPunchCardInfo(options.id)
  },

  // 获取当前年月
  getCurrentDate() {
    // 刚进入页面，默认显示现在的年月
    let dateNow = new Date()
    const year = dateNow.getFullYear()
    const month = dateNow.getMonth() + 1
    this.setData({
      currentYear: year,
      currentMonth: month
    })
  },

  // 获取当前显示月份数字
  getCurrentMonthNumber() {
    let totalDays = getCurrentMonthDay(this.data.currentYear, this.data.currentMonth)
    let dateArr = []
    for (let i = 1; i <= totalDays; i++) {
      dateArr.push({ date: i })
    }
    this.setData({ dateArr })
  },

  // 获取整个日历数字
  getFullCalcNumber() {
    let yearNum = this.data.currentYear
    let monthNum = this.data.currentMonth
    // 获取月份第一天是周几
    let currentWeek = getWeeks(yearNum, monthNum)
    // 获取上个月共多少天
    let lastMonthTotalDay = getCurrentMonthDay(yearNum, monthNum, false)
    let lastMonth = []
    for (let i = 1; i <= lastMonthTotalDay; i++) {
      lastMonth.push({
        date: i,
        color: 'grey'
      })
    }
    // 上个月的部分日期
    let front = []
    if (currentWeek !== 0) {
      front = lastMonth.slice(-currentWeek)
    }
    // 下个月补充天数
    let len = 7 - (front.length + this.data.dateArr.length) % 7 == 7 ? 0 : 7 - (front.length + this.data.dateArr.length) % 7    
    let totalCalc = [...front, ...this.data.dateArr]
    let backDay = [] // 下个月补充天数
    for (let i = 1; i <= len; i++) {
      totalCalc.push({
        date: i,
        color: 'grey'
      })
      backDay.push({
        date: i,
        color: 'grey'
      })
    }
    this.setData({ 
      totalCalc,
      frontDay: front,
      backDay
    })
  },

  // 翻到上个月数据
  prevPage() {
    if (this.data.currentMonth == 1) {
      let currentYear = this.data.currentYear -1
      this.setData({
        currentMonth: 12,
        currentYear
      })
    } else {
      let currentMonth = this.data.currentMonth - 1
      this.setData({ currentMonth })
    }

    this.getCurrentMonthNumber()
    this.getFullCalcNumber()
    this.makePunchCardHeightLight(this.data.havePunchList)
    this.isShowPreviousBtn()
  },

  // 翻到下个月数据
  nextPage() {
    if (this.data.currentMonth == 12) {
      let currentYear = this.data.currentYear + 1
      this.setData({
        currentMonth: 1,
        currentYear
      })
    } else {
      let currentMonth = this.data.currentMonth + 1
      this.setData({ currentMonth })
    }
    this.getCurrentMonthNumber()
    this.getFullCalcNumber()
    this.makePunchCardHeightLight(this.data.havePunchList)
    this.isShowPreviousBtn()
  },

  // 判断是否显示下个月按钮
  isShowPreviousBtn() {
    // 当前显示月份1号的时间戳
    let currentMonthTimestamp = toTimestamp(`${this.data.currentYear}-${this.data.currentMonth}-01 00:00:01`)
    // 实际月份1号时间戳
    let dateNow = new Date()
    let realMonthTimestamp = toTimestamp(`${dateNow.getFullYear()}-${dateNow.getMonth() + 1}-01 00:00:01`)
    // 真实时间比显示时间大，则显示下个月按钮
    if (currentMonthTimestamp < realMonthTimestamp) {
      this.setData({
        showPreviousBtn: true
      })
    } else {
      this.setData({
        showPreviousBtn: false
      })
    }
  },

  // 获取打卡信息
  getPunchCardInfo(id) {
    appRequest(punchCardInfo, { vipCourceId: id }).then(res => {
      this.setData({
        havePunchList: res.data
      })
      this.makePunchCardHeightLight(res.data)
    })
  },

  /**
   * 判断打卡高亮
   * @param {Array} havePunchList 所有打卡记录
   */
  makePunchCardHeightLight(havePunchList) {
    let dateArrNumber = this.data.dateArr
    let currentYear = this.data.currentYear
    let currentMonth = this.data.currentMonth
    let fullDateArr = []
    let currentMonthPunch = 0
    if (currentMonth < 10) {
      currentMonth = '0' + currentMonth
    }
    // 获取当月所有天数的0点到12点日期
    dateArrNumber.forEach((v, index) => {
      +v.date < 10 ? v.date = `${currentYear}-${currentMonth}-0${v.date}` : v.date = `${currentYear}-${currentMonth}-${v.date}`;
      fullDateArr.push({
        start: toTimestamp(`${v.date} 00:00:01`),
        end: toTimestamp(`${v.date} 23:59:59`),
        date: index + 1
      })
    })
    
    for (let v of fullDateArr) {
      let isPunched = havePunchList.filter(ele => {
        let punchTime = toTimestamp(ele.punchcardTime)
        return v.start < punchTime && v.end > punchTime
      })
      if (isPunched.length) {
        v.isPunched = true
        currentMonthPunch++
      }
    }
    this.setData({
      dateArr: fullDateArr,
      currentMonthPunch
    })
  }
})