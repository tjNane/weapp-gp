Page({
  data: {
    hotCourse: [],
    // 头像
    teacherImg: '',
    // 姓名
    teacherName: '',
    // 简介
    content: ''
  },

  onLoad: function(options) {
    this.setData({
      teacherImg: options.img,
      teacherName: options.name,
      content: options.content
    })
  },

})