/**
 * 聚合数据星座运势
 * https://www.juhe.cn/docs/api/id/58
 */
const axios = require('axios')
const schedule = require('node-schedule')
const { juhe } = require('../config')
let cacheMap = {}
// clear cache everyday
schedule.scheduleJob('0 0 0 * * *', () => cacheMap = {})

/**
 * return text
 * @param consName  xx座
 * @returns {Promise<void>}
 */
async function getTodayConstellation (consName) {
  if (cacheMap[consName]) return cacheMap[consName]
  const response = await axios({
    method: 'get',
    url: 'http://web.juhe.cn:8080/constellation/getAll',
    params: {
      consName,
      type: 'today',
      key: juhe.key // free ,100/day
    }
  })
  // console.log(response.data)
  const info = response.data
  let text = `\
【${consName}】今日运势
【情感指数】${info.love}
【健康指数】${info.health}
【财运指数】${info.money}
【工作指数】${info.work}
【综合指数】${info.all}
【幸运色】${info.color}
【速配星座】${info.QFriend}
【今日】${info.summary}
  `
  return cacheMap[consName] = text
}

module.exports = {
  getTodayConstellation
}
