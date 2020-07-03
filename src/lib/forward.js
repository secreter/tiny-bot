const config = require('../config')
const { sleep } = require('../lib/utils')
const jobKeywords = {
  '招聘': 3,
  '招募': 3,
  '实习': 3,
  '简历': 3,
  '薪资': 3,
  '福利': 3,
  '工资': 3,
  '任职': 3,
  '投递': 3,
  '留用': 3,
  '面试': 3,
  '面议': 3,
  '不限': 3,
  '岗位': 3,
  '期权': 3,
  '工作': 2,
  '内容': 2,
  '职责': 2,
  '负责': 2,
  '要求': 2,
  '资格': 2,
  '地点': 2,
  '学历': 2,
  '毕业': 2,
  '经验': 2,
  '专业': 2,
  '邮件': 2,
  '邮箱': 2,
  '团队': 2,
  '时间': 1,
  '学校': 1,
  '行业': 1,
  '熟悉': 1,
  '机会': 1,
  '城市': 1
}

/**
 * 根据配置指定人和群转发，有主播、主群、从群
 * @param bot
 * @param message
 * @returns {Promise<void>}
 */
async function configForward (bot, message) {
  if (!config.room.forward) return
  const topic = await message.room().topic()
  // console.log(config.room.forwardMain, topic)
  if (topic !== config.room.forwardMain) return // 不是主播群不监控
  const sender = message.from()
  const senderName = await sender.name()
  // 设置了转发的人
  if (config.room.forwardPerson && senderName !== config.room.forwardPerson) return
  // 没设置就转发自己的
  let to
  for (let i = 0; i < config.room.forwardList.length; i++) {
    to = await bot.Room.find({ topic: config.room.forwardList[i] })
    if (!to) continue
    await sleep(2000)
    await message.forward(to)
  }
}

/**
 * 转发招聘信息到指定的群，暂时写死
 * @param bot
 * @param message
 * @returns {Promise<void>}
 */
async function jobForward (bot, message) {
  const text = message.text()
  const topic = await message.room().topic()
  // 不监听job 转发群
  if (config.room.jobRoomList.includes(topic)) return
  // 排除太短的
  if (text.length < 50) return
  let score = 0
  for (let keyword in jobKeywords) {
    if (text.includes(keyword)) {
      score += jobKeywords[keyword]
    }
  }
  // let to = await bot.Room.find({ topic: config.room.jobRoom })
  let to
  for (let i = 0; i < config.room.jobRoomList.length; i++) {
    to = await bot.Room.find({ topic: config.room.jobRoomList[i] })
    if (!to) continue
    await sleep(5000)
    if (score > 6) {
      await message.forward(to)
    }
  }
  console.log('job msg confidence:', score)
}

module.exports = {
  configForward,
  jobForward
}
