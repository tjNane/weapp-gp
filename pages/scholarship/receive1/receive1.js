import { appRequest, baseUrl } from '../../../utils/request.js'
import { scholarTypeList, uploadUrl, saveApplyInfo, intentionCompany } from '../../../api/scholarship.js'

Page({

  data: {
    // 奖学金列表
    scholarList: [],
    // 意向公司
    intentionList: [],
    // 当前页
    currentPage: 1,
    // offer图片列表
    offerImgList: [],
    // 是否显示上传按钮
    showAddBtn: true,
    // 姓名
    username: '',
    // 身份证
    idcard: '',
    // 手机
    tell: '',
    // 邮箱
    email: '',
    // 选择的奖学金类型id
    currentScholarId: '',
    // 选中的意向公司
    currentCompany: {},
    // 验证失败自动聚焦
    usernameFocus: false,
    idcardFocus: false,
    tellFocus: false,
    emailFocus: false
  },

  onReady() {
    // 获得弹窗组件
    this.popup = this.selectComponent("#pop")
    this.pop2 = this.selectComponent("#pop2")
  },

  onLoad: function (options) {
    this.getScholarTypeList()
    this.getIntentionCompany()
  },

  // 选择奖学金
  selectScholar(e) {
    let index = e.currentTarget.dataset.idx
    let id = e.currentTarget.dataset.id
    let scholarList = this.data.scholarList
    for (let i = 0; i < scholarList.length; i++) {
      scholarList[i].checked = false
      if (!scholarList[index].checked) {
        scholarList[index].checked = true
      }
    }
    this.setData({
      scholarList,
      currentScholarId: id
    })
  },

  // 选择公司
  selectCompany() {
    this.popup.showPopUp()
  },

  // 取消选择
  cancelSelect() {
    this.popup.hidePopUp()
  },

  // 下一步
  toNext() {
    if (!this.data.offerImgList.length) {
      wx.showToast({
        title: '请上传录取图片',
        icon: 'none'
      })
      return
    }
    this.setData({
      currentPage: 2
    })
    wx.setNavigationBarTitle({
      title: '领取奖学金2/2'
    })
  },

  // 上一步
  toPrevPage() {
    this.setData({
      currentPage: 1
    })
    wx.setNavigationBarTitle({
      title: '领取奖学金1/2'
    })
  },

  // 姓名
  watchUsername(e) {
    this.setData({ username: e.detail.value })
  },

  // 身份证
  watchIdcard(e) {
    this.setData({ idcard: e.detail.value })
  },

  // 手机
  watchTell(e) {
    this.setData({ tell: e.detail.value })
  },

  // 手机
  watchEmail(e) {
    this.setData({ email: e.detail.value })
  },

  // 协议弹窗
  showProtocol() {
    // 身份证验证
    let regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    // 手机号验证
    let regTell = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    // 邮箱验证
    let regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;

    if (!this.data.username) {
      wx.showToast({ title: '姓名不能为空', icon: 'none' })
      this.setData({ usernameFocus: true })
      return
    }
    if (!regIdNo.test(this.data.idcard)) {
      wx.showToast({ title: '身份证有误', icon: 'none' })
      this.setData({ idcardFocus: true })
      return
    }
    if (!regTell.test(this.data.tell)) {
      wx.showToast({ title: '手机号有误', icon: 'none' })
      this.setData({ tellFocus: true })
      return
    }
    if (!regEmail.test(this.data.email)) {
      wx.showToast({ title: '邮箱有误', icon: 'none' })
      this.setData({ emailFocus: true })
      return
    }
    if (!this.data.offerImgList.length) {
      wx.showToast({ title: '未上传offer图片', icon: 'none' })
      return
    }
    this.pop2.showPopUp()
  },

  // 提交
  submitForm() {
    let params = {
      name: this.data.username,
      identityCard: this.data.idcard,
      mobile: this.data.tell,
      email: this.data.email,
      scholarshipId: this.data.currentScholarId,
      companyId: this.data.currentCompany.companyId,
      positionId: this.data.currentCompany.positionId,
      offerurl: this.data.offerImgList.join()
    }
    appRequest(saveApplyInfo, params, 'POST').then(res => {
      wx.navigateTo({
        url: '../scholar/scholar?isBackTwo=true',
      })
      this.pop2.hidePopUp()
    })
  },

  // 关闭弹窗
  closeDialog() {
    this.pop2.hidePopUp()
  },

  // 获取奖学金类型列表
  getScholarTypeList() {
    appRequest(scholarTypeList).then(res => {
      let resData = res.data
      resData.forEach((item, index) => {
        item.checked = index == 0 ? true : false

        if (index == 0) {
          item.icon = '../../../images/scholarship/icon1.png'
        } else if (index == 1) {
          item.icon = '../../../images/scholarship/icon2.png'
        } else if (index == 2) {
          item.icon = '../../../images/scholarship/icon3.png'
        } else {
          item.icon = '../../../images/scholarship/icon1.png'
        }
      })
      this.setData({
        scholarList: resData,
        currentScholarId: resData[0].id
      })
    })
  },

  // 上传图片
  uploadImg() {
    wx.chooseImage({
      count: 1,
      success: res => {
        const tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: baseUrl + uploadUrl,
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            needcdn: 1,
            uploadPath: 'offerimg'
          },
          success: result => {
            let list = this.data.offerImgList
            list.push(JSON.parse(result.data).data)
            this.setData({
              offerImgList: list
            })
            this.isTwoPhote()
          }
        })
      }
    })
  },

  // 删除offer图片
  deleteOfferImg(e) {
    wx.showModal({
      title: '删除提示',
      content: '是否删除选中图片',
      confirmColor: '#FD553A',
      success: res => {
        if (res.confirm) {
          let index = e.currentTarget.dataset.idx
          let list = this.data.offerImgList
          let filterRes = list.filter((ele, i) => i != index)
          this.setData({
            offerImgList: filterRes
          })
          this.isTwoPhote()
        }
      }
    })
  },

  // 检测是否上传了2张照片
  isTwoPhote() {
    let list = this.data.offerImgList
    if (list.length >= 2) {
      this.setData({
        showAddBtn: false
      })
    } else {
      this.setData({
        showAddBtn: true
      })
    }
  },

  // 获取意向公司
  getIntentionCompany() {
    appRequest(intentionCompany, { offset: 0, limit: 3 }).then(res => {
      let resData = res.data.rows
      resData.forEach(ele => {
        if (ele.status == 0) {
          ele.statusText = '审核中'
        } else if (ele.status == 1) {
          ele.statusText = '审核通过'
        } else if (ele.status == 2) {
          ele.statusText = '发送面试邀请'
        } else if (ele.status == 3) {
          ele.statusText = '面试成功'
        } else if (ele.status == 4) {
          ele.statusText = '面试失败'
        }
      })
      let currentCompany = resData.filter(ele => ele.status == 3)
      this.setData({
        intentionList: resData,
        currentCompany: currentCompany.length ? currentCompany[0] : {}
      })
    })
  },

  // 选择意向公司
  selectIntention(e) {
    let status = e.currentTarget.dataset.item.status
    let companyId = e.currentTarget.dataset.item.companyId
    let positionId = e.currentTarget.dataset.item.positionId
    if (status != 3) return
    this.setData({
      currentCompany: e.currentTarget.dataset.item
    })
    this.popup.hidePopUp()
  }
})