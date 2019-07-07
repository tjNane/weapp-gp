/**
 * 判断本月的一号是周几
 */
export function getWeek() {
  var dateNow = new Date()
  var currentWeek = dateNow.getDay() // 当前星期几（0-6,0为星期日）
  var currentDate = dateNow.getDate() // 当前日
  var week = currentWeek - (currentDate % 7 - 1)
  return week < 0 ? 7 + week : week
}

/**
 * 判断当月有几天
 * @param {Number} year 年
 * @param {Number} month 月
 * @param {Boolean} cur 是否为当月，false为上个月
 */
export function getCurrentMonthDay(year, month, cur = true) {
  if (!cur) {
    month > 0 ? month = month - 1 : month = 12
    if (month == 1) {
      year -= 1
    }
  }
  return new Date(year, month, 0).getDate()
}

/**
 * 判断某年某月的一号是周几
 * @param {Number} year 年
 * @param {Number} month 月
 */
export function getWeeks(year, month) {
  var dateNow = new Date('' + year + ',' + month + ',01')
  var weekday = dateNow.getDay()
  return weekday
}

/**
 * 生成随机数
 * @param {Number} len 随机数长度
 */
export function getRandom(len) {
  var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  var res = ""
  for (var i = 0; i < len; i++) {
    var id = Math.ceil(Math.random() * chars.length - 1)
    res += chars[id]
  }
  return res
}

/**
 * 时间转时间戳
 */
export function toTimestamp(date) {
  return new Date(date.replace(/-/g, "/")).getTime()
}