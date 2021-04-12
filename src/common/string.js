export default {
  time2string: function (hour, minute) {
    hour = hour
    minute = minute

    const ampm = parseInt(hour) >= 12 ? 'pm' : 'am'
    let showHour = hour % 12
    if (showHour === 0) showHour = 12

    return hour === 24 ? '11:59 pm' : `${showHour}:${minute} ${ampm}`
  },
  
  str2times: function (str) {
    const times = str.split(':')
    return times
  },
  
  stripFoodName: function (foodName) {
    if (foodName == '') return ''
    const reg = /[(.+?)]/g
    const f = foodName.toString().replace(reg, "").trim()
    return f
  },
  splitFoodName: function (foodName) {
    var reg = /[(.+?)]/g
    if ((foodName = foodName.match(reg, ""))) {
      foodName = foodName[0].replace("[", "").replace("]", "").trim();
    }
    return foodName;
  },
  replaceIcon: function (icon) {
    icon = icon.replace("public", "storage");
    return icon;
  },
}