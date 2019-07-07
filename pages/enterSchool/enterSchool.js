Page({

  data: {
    bookList: [],
    // 当前展示学科
    currentBook: ''
  },

  onLoad: function (options) {
    const id = options.id

    switch (id) {
      case '1':
        this.setData({ currentBook: this.data.bookList[0] })
        break;
      case '2':
        this.setData({ currentBook: this.data.bookList[1] })
        break;
      case '4':
        this.setData({ currentBook: this.data.bookList[2] })
        break;
      case '6':
        this.setData({ currentBook: this.data.bookList[3] })
        break;
      case '8':
        this.setData({ currentBook: this.data.bookList[4] })
        break;
      case '9':
        this.setData({ currentBook: this.data.bookList[5] })
        break;
      case '10':
        this.setData({ currentBook: this.data.bookList[6] })
        break;
      default:
        this.setData({ currentBook: this.data.bookList[0] })
    }
  },

})