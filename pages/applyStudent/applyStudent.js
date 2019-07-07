import {
  appRequest,
  baseUrl
} from '../../utils/request.js'
import {
  subjectList,
  courseTeachersList,
  addVipFront,
  sendEnrolVerificationCode,
  verifyEnrolVerificationCode,
  queryLastVipByWxId
} from '../../api/applyStudent.js'

var interval = null //倒计时函数
Page({
  data: {
    isRefresh: 0,
    // 当前选中的tab
    currentTab: 0,
    index: 3,
    array: ['初中', '高中', '大专', '本科', '硕士', '硕士以上', '其他'],
    jobIndex: 0,
    jobArray: ['软件工程师', '中级软件工程师', '高级软件工程师', '项目组长', '项目经理', '架构师', '技术总监', '大数据开发', '运维开发工程师', '软件测试', '产品经理', '其他'],
    annualSalaryIndex: 1,
    expectSalaryIndex: 2,
    annualSalaryArray: ['0-10W', '11-20W', '21-30W', '31-40W', '41-50W', '51-60W', '61-70W', '71-80W', '81-90W', '100W以上'],
    understandGupaoIndex: 0,
    understandGupaoArray: ['腾讯课堂', 'QQ群', '论坛', '头条', '简书', '公众号', '网易云课堂', '搜索引擎', '朋友推荐', '钉钉', '其他'],
    lecturesIndex: 2,
    lecturesTimeArray: ['没听过', '1次', '2-6次', '6-15次', '15次以上'],
    areaCodeIndex: 0,
    areaCodeStr: '+86',
    areaCode: [{
      name: '中国',
      code: '+86'
    }, {
      name: '美国',
      code: '+1'
    }, {
      name: '中国香港',
      code: '+852'
    }, {
      name: '中国台湾',
      code: '+886'
    }, {
      name: '日本',
      code: '+81'
    }, {
      name: '澳大利亚',
      code: '+61'
    }, {
      name: '新加坡',
      code: '+65'
    }, {
      name: '韩国',
      code: '+82'
    }, {
      name: '马来西亚',
      code: '+60'
    }, {
      name: '加拿大',
      code: '+1'
    }, {
      name: '英国',
      code: '+44'
    }, {
      name: '其他',
      code: ''
    }],
    gender: 1,
    studentSubject: [],
    applyInfo: {
      vipSex: '男',
      vipRecommend: 0,
      vipEducation: '本科',
      vipPosition: '软件工程师',
      vipAnnualSalary: '11-20W',
      vipExpectSalary: '21-30W',
      vipOrigin: '腾讯课堂',
      listenTime: '2-6次'
    },
    region: [],
    customItem: '全部',
    // 当前选中的学科
    selectedSubject: null,
    verificationCode: '',
    teachersListByCourseId: [],
    chooseTeachers: [],
    applyCourseId: 0,
    vipPubTeacher: '',
    checkConfirmflag: 0,
    time: '获取验证码', //倒计时 
    currentTime: 60,
    checkUserItem: [],
    checkCount: 0,
    // 选中的老师数组
    checkedTeacherList: [],
    // 是否展示textarea
    showTextarea: false,
    vipTel: ''
  },

  onLoad: function(options) {
    this.getSubjectList()
    //获取上次申请学籍信息
    this.getApplyInfo()
    // 获得弹窗组件
    this.popup = this.selectComponent("#pop")
  },

  onShow() {
    if (this.data.isRefresh) {
      this.onLoad()
      this.setData({
        isRefresh: 0
      })
    }
  },

  getApplyInfo() {
    appRequest(queryLastVipByWxId, {}, 'GET', false).then(res => {
      if (res.success) {
        if (res.data) {
          this.setData({
            applyInfo: {},
          })
          let applyInfoResult = res.data
          let applyInfo = {}
          applyInfo.vipName = applyInfoResult.vipName
          applyInfo.vipAge = applyInfoResult.vipAge
          applyInfo.vipSex = applyInfoResult.vipSex
          applyInfo.vipTel = applyInfoResult.vipTel
          applyInfo.vipQq = applyInfoResult.vipQq
          applyInfo.vipWorkAge = applyInfoResult.vipWorkAge
          applyInfo.vipProvince = applyInfoResult.vipProvince
          applyInfo.vipCity = applyInfoResult.vipCity
          applyInfo.vipCompany = applyInfoResult.vipCompany
          applyInfo.vipPosition = applyInfoResult.vipPosition
          applyInfo.vipEducation = applyInfoResult.vipEducation
          applyInfo.vipAnnualSalary = applyInfoResult.vipAnnualSalary
          applyInfo.vipExpectSalary = applyInfoResult.vipExpectSalary
          applyInfo.vipRecommend = applyInfoResult.vipRecommend
          applyInfo.vipOrigin = applyInfoResult.vipOrigin
          applyInfo.listenTime = applyInfoResult.listenTime
          applyInfo.vipCourceId = null
          applyInfo.vipStuRemark = null
          applyInfo.teachersIds = null
          applyInfo.vipPubTeacher = null


          

          this.setData({
            applyInfo: applyInfo,
            gender: applyInfo.vipSex == '男' ? 1 : 0,
            vipTel: applyInfo.vipTel
          })
        }

      }
    })
  },


  // 打开弹窗
  showPopUp(e) {
    this.popup.showPopUp()
    let courseId = this.data.applyCourseId
    let userType = 1
    if (!this.data.teachersListByCourseId.length) {
      appRequest(courseTeachersList, {
        courseId,
        userType
      }).then(res => {
        if (res.success) {
          for (let item of res.data) {
            item.checked = false
          }
          this.setData({
            teachersListByCourseId: res.data
          });
          let noChoice = {}
          noChoice.userId = -1
          noChoice.userName = '无'
          noChoice.checked = false
          this.setData({
            teachersListByCourseId: this.data.teachersListByCourseId.concat(noChoice)
          })
        }
      })
    }

  },
  getSubjectList() {
    let list = []
    let course = appRequest(subjectList).then(res => {
      if (res.success) {
        list = res.data
        for (const item of list) {
          item.imageUrl = '../../images/subject-test.png'
        }
        this.setData({
          studentSubject: list
        })
      }

    })
  },
  // 切换tab
  switchTab(e) {
    let index = e.currentTarget.dataset.idx
    this.setData({
      currentTab: index
    })
  },
  checkConfirm(applyCourseId, index) {
    this.setData({
      checkConfirmflag: 0
    })
    if (applyCourseId == 0) {
      wx.showToast({
        title: '请选择申请的学科',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (index == 1) {
      if (!this.data.applyInfo.vipName) {
        wx.showToast({
          title: '请输入姓名',
          icon: 'none',
          duration: 2000
        })
        return
      }
      if (!this.data.applyInfo.vipAge) {
        wx.showToast({
          title: '请输入年龄',
          icon: 'none',
          duration: 2000
        })
        return
      }
      if (!this.data.applyInfo.vipProvince || !this.data.applyInfo.vipCity) {
        wx.showToast({
          title: '请选择城市',
          icon: 'none',
          duration: 2000
        })
        return
      }
      let phone = this.data.vipTel
      if (!phone) {
        wx.showToast({
          title: '请输入手机号码',
          icon: 'none',
          duration: 2000
        })
        return
      }
      let checkPhoneNum = this.checkPhoneNum(phone)
      if (!checkPhoneNum) {
        return
      }
      if (!this.data.verificationCode) {
        wx.showToast({
          title: '请输入验证码',
          icon: 'none',
          duration: 2000
        })
        return
      }
      let qqNum = this.data.applyInfo.vipQq
      if (!qqNum) {
        wx.showToast({
          title: '请输入QQ号',
          icon: 'none',
          duration: 2000
        })
        return
      }
      let checkQqNum = this.checkQqNum(qqNum);
      if (!checkQqNum) {
        return
      }
    }
    if (index == 2) {
      if (!this.data.applyInfo.vipCompany) {
        wx.showToast({
          title: '请输入所在公司',
          icon: 'none',
          duration: 2000
        })
        return
      }
      if (!this.data.applyInfo.vipWorkAge) {
        wx.showToast({
          title: '请输入工作年限',
          icon: 'none',
          duration: 2000
        })
        return
      }
    }
    if (index == 3) {}
    this.setData({
      checkConfirmflag: 1
    })
  },

  switchNext(e) {
    let applyCourseId = this.data.applyCourseId
    let index = e.currentTarget.dataset.idx;
    this.checkConfirm(applyCourseId, index)
    if (this.data.checkConfirmflag == 0) {
      return
    }
    index = +index + 1;
    this.setData({
      currentTab: index
    })
  },
  switchPrevious(e) {
    let index = e.currentTarget.dataset.idx
    this.setData({
      currentTab: index - 1
    })
  },
  applyConfirm(e) {
    if (!this.data.vipPubTeacher) {
      wx.showToast({
        title: '请选择老师',
        icon: 'none',
        duration: 2000
      })
      return
    }
    let vipRecommend = this.data.applyInfo.vipRecommend
    if (vipRecommend == 1) {
      let vipRecommendName = this.data.applyInfo.vipRecommendName
      if (!vipRecommendName) {
        wx.showToast({
          title: '请输入vip学员QQ号',
          icon: 'none',
          duration: 2000
        })
        return
      }
      let checkQqNum = this.checkQqNum(vipRecommendName);
      if (!checkQqNum) {
        return
      }
    }
    let phone = this.data.vipTel
    let uniqueCode = wx.getStorageSync('token')
    let code = this.data.verificationCode
    appRequest(verifyEnrolVerificationCode, {
      phone,
      uniqueCode,
      code
    }).then(res => {
      if (res.data) {
        let applyInfo = this.data.applyInfo
        let vipTel = this.data.areaCodeStr + this.data.vipTel
        this.setData({
          "applyInfo.teachersIds": JSON.stringify(applyInfo.teachersIds),
          "applyInfo.vipTel": vipTel
        })
        wx.request({
          url: baseUrl + addVipFront,
          data: applyInfo,
          header: {
            token: uniqueCode
          },
          method: 'POST',
          success: function(res) {
            if (res.statusCode == 200 && res.data.success) {
              wx.showModal({
                title: '提示',
                content: '申请成功，赶快去学习吧',
                success: function(res) {
                  if (res.confirm) {
                    wx.reLaunch({
                      url: '../learningCenter/learningCenter'
                    })
                  }
                }
              })
            } else {
              wx.showToast({
                title: res.data.message,
                icon: 'none',
                duration: 2000
              })
            }
          }
        })
      } else {
        wx.showToast({
          title: '短信验证码错误，请确认是否正确',
          icon: 'none',
          duration: 2000
        })
        return
      }
    })
  },
  bindRegionChange: function(e) {
    let provinceCity = e.detail.value
    this.setData({
      region: e.detail.value,
      "applyInfo.vipProvince": provinceCity[0],
      "applyInfo.vipCity": provinceCity[1]
    })
  },
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value,
      "applyInfo.vipEducation": this.data.array[e.detail.value]
    })
  },
  // 选择学科
  chooseSubject(e) {
    this.setData({
      selectedSubject: e.currentTarget.dataset.idx,
      applyCourseId: e.currentTarget.dataset.id,
      "applyInfo.vipCourceId": e.currentTarget.dataset.id,
      teachersListByCourseId: [],
      vipPubTeacher: '',
      "applyInfo.teachersIds": [],
      "applyInfo.vipPubTeacher": '',
      chooseTeachers: [],
      checkCount: 0
    })
  },
  btnChooseTeachers: function(e) {
    let userId = e.currentTarget.dataset.id
    console.log(userId)
    let idx = e.currentTarget.dataset.index
    let checkedItem = e.currentTarget.dataset.checked
    // 选中的老师数组
    let checkedTeacherList = this.data.checkedTeacherList
    // 所有老师的数组
    let teachersListByCourseId = this.data.teachersListByCourseId
    let checkCount = this.data.checkCount
    let vipPubTeacher = ''
    if (checkedItem == false) {
      if (userId == -1) {
        for (let checkUser of teachersListByCourseId) {
          if (checkUser.userId == -1) {
            checkUser.checked = true
          } else {
            checkUser.checked = false
          }
        }
        let teachersInfo = {}
        let teacherList = []
        teachersInfo.teacherId = '无'
        teachersInfo.teacherName = '无'
        teacherList.push(teachersInfo)
        this.setData({
          vipPubTeacher: '无',
          "applyInfo.teachersIds": teacherList,
          "applyInfo.vipPubTeacher": '无',
          teachersListByCourseId: teachersListByCourseId,
          chooseTeachers: [],
          checkCount: 0
        })
        return false
      }

      for (let checkUser of teachersListByCourseId) {
        if (checkUser.userId == -1 && checkUser.checked) {
          wx.showToast({
            title: '选择无不能选择其它项',
            icon: 'none',
            duration: 2000
          })
          return false
        }
      }
      if (checkCount == 3) {
        wx.showToast({
          title: '最多只能选择三个',
          icon: 'none',
          duration: 2000
        })
        return false
      }
    }
    this.setData({
      vipPubTeacher: '',
      chooseTeachers: []
    })

    for (let item of teachersListByCourseId) {
      let teacherInfo = {}
      if (item.userId == userId) {
        if (item.checked) {
          item.checked = false
          if (userId != -1) {
            this.setData({
              checkCount: checkCount - 1
            })
          }
        } else {
          item.checked = true
          this.setData({
            checkCount: checkCount + 1
          })
        }
      }
    }
    this.setData({
      teachersListByCourseId: teachersListByCourseId
    })

    for (let checkUser of teachersListByCourseId) {
      let teacherInfo = {}
      if (checkUser.checked) {
        vipPubTeacher += checkUser.userName + ','
        teacherInfo.teacherId = checkUser.userId
        teacherInfo.teacherName = checkUser.userName
        this.setData({
          chooseTeachers: this.data.chooseTeachers.concat(teacherInfo)
        })
      }
    }

    if (vipPubTeacher.length > 0) {
      vipPubTeacher = vipPubTeacher.substr(0, vipPubTeacher.length - 1)
      this.setData({
        vipPubTeacher: vipPubTeacher,
        "applyInfo.teachersIds": this.data.chooseTeachers,
        "applyInfo.vipPubTeacher": vipPubTeacher
      })
    }

  },
  bindJobChange: function(e) {
    this.setData({
      jobIndex: e.detail.value,
      "applyInfo.vipPosition": this.data.jobArray[e.detail.value]
    })
  },
  bindAnnualChange: function(e) {
    this.setData({
      annualSalaryIndex: e.detail.value,
      "applyInfo.vipAnnualSalary": this.data.annualSalaryArray[e.detail.value]
    })
  },
  bindExpectAnnualChange: function(e) {
    this.setData({
      expectSalaryIndex: e.detail.value,
      "applyInfo.vipExpectSalary": this.data.annualSalaryArray[e.detail.value]
    })
  },
  bindUnderstandGupaoChange: function(e) {
    this.setData({
      understandGupaoIndex: e.detail.value,
      "applyInfo.vipOrigin": this.data.understandGupaoArray[e.detail.value]
    })
  },
  bindLecturesChange: function(e) {
    this.setData({
      lecturesIndex: e.detail.value,
      "applyInfo.listenTime": this.data.lecturesTimeArray[e.detail.value]
    })
  },
  getVerificationCode: function(e) {
    let phone = this.data.vipTel
    if (!phone) {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none',
        duration: 2000
      })
      return
    }
    let checkPhoneNum = this.checkPhoneNum(phone)
    if (checkPhoneNum) {
      this.sendVerificationCode(phone)
      this.setData({
        disabled: true
      })
    }
  },

  sendVerificationCode(phone) {
    var that = this;
    var currentTime = that.data.currentTime
    interval = setInterval(function() {
      currentTime--;
      that.setData({
        time: currentTime + '秒'
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: '获取验证码',
          currentTime: 60,
          disabled: false
        })
      }
    }, 1000)
    let uniqueCode = wx.getStorageSync('token')
    appRequest(sendEnrolVerificationCode, {
      phone,
      uniqueCode
    }).then(res => {
      if (res.success) {
        console.log(res)
      }
    })
  },

  //------------------更改表单数据----------------
  //更改性别
  changeGender: function(e) {
    let index = e.currentTarget.dataset.id
    this.setData({
      gender: index,
      "applyInfo.vipSex": index == 1 ? '男' : '女'
    })
  },
  //获取用户名
  getVipName: function(e) {
    let vipName = e.detail.value;
    this.setData({
      "applyInfo.vipName": vipName
    })
  },
  getVipAge: function(e) {
    let vipAge = e.detail.value;
    if (vipAge > 100 || vipAge < 0) {
      wx.showToast({
        title: '请输入18-100的真实年龄',
        icon: 'none',
        duration: 2000
      })
      this.setData({
        "applyInfo.vipAge": ''
      })
    } else {
      this.setData({
        "applyInfo.vipAge": vipAge
      })
    }
  },
  getVipTel: function(e) {
    let vipTel = e.detail.value;
    this.setData({
      vipTel
    })
  },
  checkPhoneNum: function(vipTel) {
    // if (vipTel.length === 11) {
    //   let str = /^1\d{10}$/
    //   if (str.test(vipTel)) {
    //     return true
    //   } else {
    //     wx.showToast({
    //       title: '手机号码格式不正确',
    //       icon: 'none',
    //       duration: 2000
    //     })
    //     return false
    //   }
    // } else {
    //   wx.showToast({
    //     title: '手机号码格式不正确',
    //     icon: 'none',
    //     duration: 2000
    //   })
    //   return false
    // }
    return true
  },
  checkQqNum: function(qqNum) {
    if (qqNum.length > 15 || qqNum.length < 5) {
      wx.showToast({
        title: 'QQ号码格式不正确',
        icon: 'none',
        duration: 2000
      })
      return false
    } else {
      return true
    }
  },
  getVipQq: function(e) {
    let vipQq = e.detail.value;
    this.setData({
      "applyInfo.vipQq": vipQq
    })
  },
  getVipCompany: function(e) {
    let vipCompany = e.detail.value;
    this.setData({
      "applyInfo.vipCompany": vipCompany
    })
  },
  getVipRecommend: function(e) {
    let vipRecommend = e.detail.value;
    if (vipRecommend == 0) {
      this.setData({
        "applyInfo.vipRecommendName": ''
      })
    }
    this.setData({
      "applyInfo.vipRecommend": vipRecommend
    })
  },
  getVipRecommendName: function(e) {
    let vipRecommendName = e.detail.value;
    this.setData({
      "applyInfo.vipRecommendName": vipRecommendName
    })
  },
  getVipStuRemark: function(e) {
    let vipStuRemark = e.detail.value;
    this.setData({
      "applyInfo.vipStuRemark": vipStuRemark
    })
  },
  getInputVerificationCode: function(e) {
    let verificationCode = e.detail.value;
    this.setData({
      verificationCode
    })
  },
  getVipWorkAge: function(e) {
    let vipWorkAge = e.detail.value;
    this.setData({
      "applyInfo.vipWorkAge": vipWorkAge
    })
  },
  bindAreaCodeChange: function(e) {
    let areaCodeIndex = e.detail.value;
    let areaCodeStr = this.data.areaCode[areaCodeIndex].code
    this.setData({
      areaCodeStr,
      areaCodeIndex
    })
  },
  closepop() {
    this.popup.hidePopUp()
  },
  toggleTextShow() {
    this.setData({
      showTextarea: !this.data.showTextarea
    })
  },

  onShareAppMessage() {
    return {
      title: '申请学籍',
      path: '/pages/applyStudent/applyStudent'
    }
  }
})