import { appRequest } from '../../../utils/request.js'
import { companyList, positionList, queryResumeInfo, confirmApply, afterScancode } from '../../../api/scholarship.js'

Page({

  data: {
    // 年薪列表
    salaryList: ['0 - 10万','10 - 20万', '20 - 30万', '30 - 40万', '40 - 50万', '50 - 60万', '70 - 80万', '80 - 90万', '100万以上', ],
    // 当前选中年薪
    currentSalary: 0,
    // 当前选中期望年薪
    currentHopeSalary: 1,
    // 选中意向公司列表
    selectedIntentionList: [],
    // 意向公司列表
    intentionList: [],
    // 当前选择是公司还是职位 1公司 2职位
    currentSelect: 1,
    // 职位列表
    positionList: [],
    // 当前选择公司和职位
    companyId: '',
    companyImg: '',
    companyName: '',
    positionId: '',
    positionName: '',
    // 定时器
    timer: '',
    // 简历详情
    resumeDetail: null
  },

  onLoad: function(options) {
    this.getSelectList()
    this.queryHaveResume()
  },

  onReady() {
    // 获得弹窗组件
    this.popup = this.selectComponent("#pop")
    this.select = this.selectComponent("#select")
  },

  // 选择年薪
  chooseSalary(e) {
    this.setData({
      currentSalary:e.detail.value
    })
  },

  // 选择期望年薪
  chooseHopeSalary(e) {
    this.setData({
      currentHopeSalary: e.detail.value
    })
  },

  // 打开扫码弹窗
  uploadResume() {
    this.popup.showPopUp()
  },

  // 关闭扫码弹窗
  closeDialog() {
    this.popup.hidePopUp()
  },

  // 添加意向公司
  addCompany() {
    if (this.data.selectedIntentionList.length >= 3) {
      wx.showToast({title: '最多添加3个意向公司', icon: 'none'})
      return
    }
    this.select.showPopUp()
  },

  // 删除选中的意向公司
  deleteCompany(e) {
    wx.showModal({
      title: '删除提示',
      content: '是否删除选中意向公司',
      confirmColor: '#FD553A',
      success: res => {
        if (res.confirm) {
          let idx = e.currentTarget.dataset.idx
          let list = this.data.selectedIntentionList
          let filterRes = list.filter((ele, index) => index != idx)
          this.setData({
            selectedIntentionList: filterRes
          })
        }
      }
    })
  },

  // 返回上一级
  backUp() {
    this.setData({ currentSelect: 1 })
  },

  // 扫码
  scancode() {
    wx.scanCode({
      onlyFromCamera: true,
      success: res => {
        appRequest(afterScancode, { uuid: JSON.parse(res.path).uuid }, 'POST').then(result => {
          this.popup.hidePopUp()
          // 扫码成功后开始轮询
          this.queryHaveResume()
        })
      },
      fail: res => {
        console.log(res)
      }
    })
  },

  // 轮询简历是否上传成功
  queryHaveResume() {
    appRequest(queryResumeInfo, {}, 'GET', false).then(res => {
      if (!res.data) {
        this.setData({
          timer: setTimeout(() => {
            this.queryHaveResume()
          }, 10000)
        })
      } else {
        console.log(res)
        this.setData({
          resumeDetail: res.data
        })
      }
    })
  },

  // 页面卸载清除定时器
  onUnload() {
    clearTimeout(this.data.timer)
  },

  // 获取公司列表和职位列表
  getSelectList() {
    let param = {
      offset: 0,
      limit: 30
    }
    appRequest(companyList, param).then(res => {
      this.setData({
        intentionList: res.data.rows
      })
    })

    appRequest(positionList, param).then(res => {
      this.setData({
        positionList: res.data.rows
      })
    })
  },

  // 选择公司
  selectCompany(e) {
    let id = e.currentTarget.dataset.id
    let img = e.currentTarget.dataset.img
    let name = e.currentTarget.dataset.name
    this.setData({ 
      companyId: id,
      companyImg: img,
      companyName: name,
      currentSelect: 2
    })
  },

  // 选择职位
  selectPosition(e) {
    let id = e.currentTarget.dataset.id
    let name = e.currentTarget.dataset.name
    this.setData({
      positionId: id,
      positionName: name
    })

    let list = this.data.selectedIntentionList
    let item = {
      companyId: this.data.companyId,
      companyImg: this.data.companyImg,
      companyName: this.data.companyName,
      positionId: this.data.positionId,
      positionName: this.data.positionName
    }
    list.push(item)

    this.setData({
      selectedIntentionList: list,
      currentSelect: 1
    })
    this.cancelSelect()
  },

  // 取消选择
  cancelSelect() {
    this.setData({
      companyId: '',
      positionId: '',
      companyImg: '',
      companyName: '',
      positionName: ''
    })
    this.select.hidePopUp()
  },

  // 提交申请
  submitApply() {
    if (!this.data.resumeDetail) {
      wx.showToast({ title: '简历未上传', icon: 'none' })
      return
    }
    let selectList = this.data.selectedIntentionList
    if (!selectList.length) {
      wx.showToast({ title: '未添加意向公司', icon: 'none' })
      return
    }
    let intentionCompanys = []
    for (let v of selectList) {
      intentionCompanys.push({
        companyId: v.companyId,
        positionId: v.positionId
      })
    }
    let form = {
      currentAnnualSalary: this.data.salaryList[this.data.currentSalary],
      expectedAnnualSalary: this.data.salaryList[this.data.currentHopeSalary],
      intentionCompanys: JSON.stringify(intentionCompanys)
    }
    appRequest(confirmApply, form, 'GET', false).then(res => {
      wx.navigateTo({
        url: '../check/check?isBackTwo=true'
      })
    }).catch(res => {
      wx.showToast({
        title: res.message,
        icon: 'none'
      })
    })
  }
})