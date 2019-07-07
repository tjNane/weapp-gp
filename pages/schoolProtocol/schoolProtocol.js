Page({

  data: {
    list: [],
    current: {}
  },

  onLoad: function(options) {
    const id = options.id
    let filterRes = this.data.list.filter(ele => ele.type == id)
    this.setData({ current: filterRes[0] })
  }
})

