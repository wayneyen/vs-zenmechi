let api = null

if (process.env.NODE_ENV === 'production') {
  api = 'https://zenmechi.4family.cn'
} else if (process.env.NODE_ENV === 'development') {
  api = 'http://192.168.1.147:8000'
}

// api = 'https://zenmechi.4family.cn'

let mealsDesc = {
  5: ['早餐', '午餐', '加餐', '训后', '宵夜'],
  4: ['早餐', '午餐', '加餐', '晚餐'],
  3: ['早餐', '午餐', '晚餐']
}

let mealTimes = {
  3: ['08:30', '12:30', '18:30'],
  4: ['08:30', '12:30', '16:30', '20:30'],
  5: ['08:30', '12:30', '16:00', '19:30', '21:30']
}


// 餐数数据
let mealsCountItems = [
  {
    text: '3餐',
    value: 3
  },
  {
    text: '4餐',
    value: 4
  },
  {
    text: '5餐',
    value: 5
  }
]

// 目标数据
let targetItems = [{
    sel: '/static/slim_sel.png',
    nor: '/static/slim_nor.png',
    text: '减脂',
    value: 1
  },
  {
    sel: '/static/maintain_sel.png',
    nor: '/static/maintain_nor.png',
    text: '保持现状',
    value: 2
  },
  {
    sel: '/static/muscle_sel.png',
    nor: '/static/muscle_nor.png',
    text: '增肌',
    value: 3
  }
]

// 活动数据数据
let activities = [1.2, 1.287, 1.375, 1.4625, 1.55, 1.6375, 1.725, 1.8125, 1.9]

// 活动详细说明
let getActivityDesc = function(activity) {
  let data = {}

  switch (activity) {
    case 1:
      data = {
        title: '久坐',
        text: '全天静坐，几乎不锻炼或运动；',
        text2: '连家务都不做！'
      }
      break

    case 2:
      data = {
        title: '久坐 - 轻度活动量',
        text: '如办公室职员；基本的日常家务；',
        text2: '轻微的运动。'
      }
      break

    case 3:
      data = {
        title: '轻度活动量',
        text: '工作中偶尔走动或者站立；基本的日常家务；',
        text2: '每周 2-3 次运动。'
      }
      break

    case 4:
      data = {
        title: '轻 - 中度活动量',
        text: '工作中需要走动或者站立；基本的日常家务；',
        text2: '每周 3-4 次运动。'
      }
      break

    case 5:
      data = {
        title: '中度活动量',
        text: '工作中经常走动或者站立；较多日常家务；',
        text2: '每周 4-5 次运动。'
      }
      break

    case 6:
      data = {
        title: '中 - 高度活动量',
        text: '工作中频繁走动或者站立；经常做家务；',
        text2: '每周 5-6 次运动。'
      }
      break

    case 7:
      data = {
        title: '高度活动量',
        text: '工作中有较多的体力劳动；做很多家务；',
        text2: '每周 6-7 次运动。'
      }
      break

    case 8:
      data = {
        title: '高 - 超高度活动量',
        text: '体力劳动工作；家务全包；',
        text2: '每周 6-7 次每次 60 分钟以上高强度的运动 / 抗阻训练。'
      }
      break

    case 9:
      data = {
        title: '超高度活动量',
        text: '每天都要搬砖；家务全包；',
        text2: '每天都有超过 60 分钟高强度的运动 / 抗阻训练。'
      }
      break

    default:
      data = {
        title: '',
        text: ''
      }
      break
  }

  return data
}

let types = [

]

// 性别数据
let genderItems = [{
    sel: '/static/female_sel.png',
    nor: '/static/female_nor.png',
    text: '女士',
    value: 2
  },
  {
    sel: '/static/male_sel.png',
    nor: '/static/male_nor.png',
    text: '先生',
    value: 1
  }
]

export default {
  api,
  mealsDesc,
  mealTimes,
  mealsCountItems,
  genderItems,
  targetItems,
  activities,
  getActivityDesc
}
