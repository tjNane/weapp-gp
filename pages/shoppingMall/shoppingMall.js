import {
  appRequest,
  baseUrl
} from '../../utils/request.js'
import {
  goodsList,
  goodsInfo,
  exchangesAdd
} from '../../api/shoppingMall.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goldCoin: 0,
    emailAddress: "",
    // 往期录播页码
    start: 1,
    // 往期录播每页长度
    length: 10,
    // 老师介绍列表
    shoppingList: [],
    //{ img: '../../images/shopping.png', name: 'Mic年会表演节目众筹', coin: 8, vipCoin: 6, sold: 40 },
    shoppingDetail: {},
    myAddress: {
      userName: '',
      mobile: '',
      province: '',
      city: '',
      county: '',
      detailInfo: ''
    },
    // 地址信息
    addressInfo: {},
    // 是否触底
    reachBottom: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getGoodsList()
    this.setData({
      goldCoin: options.coinsCount
    })
  },

  // 获取商品列表
  getGoodsList() {
    let page = this.data.start
    let pageSize = this.data.length
    appRequest(goodsList, {
      page,
      pageSize
    }, 'POST', false).then(res => {
      if (res.success) {
        let list = this.data.shoppingList
        list.push(...res.data.list)
        this.setData({
          shoppingList: list
        })
        if (this.data.shoppingList.length % 10 != 0) {
          this.setData({
            reachBottom: true
          })
        }
      } else {
        this.setData({
          reachBottom: true
        })
      }
    })
  },

  // 往期录播列表触底加载更多数据
  onReachBottom() {
    let start = this.data.start
    let length = this.data.shoppingList.length

    if (length >= 10 && this.data.reachBottom == false) {
      this.setData({
        start: start + 1
      })
      this.getGoodsList()
    }
  },

  //获取用户名
  bindEmailInput: function(e) {
    let email = e.detail.value;
    this.setData({
      emailAddress: email
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // 获得弹窗组件
    this.popup = this.selectComponent("#pop");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  // 打开弹窗
  showPopUp(e) {
    let id = e.currentTarget.dataset.id
    let remnants = e.currentTarget.dataset.remnants
    if (remnants == 0) {
      wx.showToast({
        title: '商品已售空，请等待补仓',
        icon: 'none',
        duration: 2000
      })
      return
    }
    this.popup.showPopUp()
    appRequest(goodsInfo, {
      id
    }).then(res => {
      if (res.success) {
        this.setData({
          shoppingDetail: res.data
        });
      }
    })
  },
  chooseAddress() {
    wx.chooseAddress({
      success: res => {
        this.setData({
          addressInfo: res
        })
        console.log(res)
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  exchanges() {
    let addressInfo = this.data.addressInfo;
    let realName = addressInfo.userName;
    let phone = addressInfo.telNumber;
    let email = this.data.emailAddress;
    let comment = addressInfo.provinceName + addressInfo.cityName + addressInfo.countyName + addressInfo.detailInfo;
    if (!comment) {
      wx.showToast({
        title: '请选择配送地址',
        icon: 'none'
      })
      return
    }
    if (!email) {
      wx.showToast({
        title: '请输入邮箱地址',
        icon: 'none'
      })
      return
    }
    let reg = new RegExp('^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$');
    if (!reg.test(email)){
      wx.showToast({
        title: '邮箱格式不正确',
        icon: 'none'
      })
      return
    }
    let coinsCount = this.data.goldCoin
    if(coinsCount<=0){
      wx.showToast({ title: '当前金币余额不足', icon: 'none' })
      return
    }
    let goodsId = this.data.shoppingDetail.id;
    let uniqueCode = wx.getStorageSync('token')
    wx.request({
      url: baseUrl + exchangesAdd,
      data: { realName, phone, email, comment, goodsId},
      header: {
        token: uniqueCode
      },
      method: 'POST',
      success: function (res) {
        if (res.statusCode == 200 && res.data.success) {
          wx.showToast({
            title: '兑换成功',
            icon: 'success',
            duration: 2000
          })
          this.setData({
            start: 1,
            shoppingList: []
          });
          this.getGoodsList(); //重新获取商品列表
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
    this.popup.hidePopUp();
  }

})