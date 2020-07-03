const { isAdmin } = require('./admin')
const adKeywords = ['领取优惠券', '复制这段消息', '打开支付宝', '识别二维码', '打个广告', '砍价', '兼职',
  '拼团', '抢购', '抢火车票', '加速'
]
async function onText (bot, message) {
  const sender = message.from()
  const text = message.text()
  if (adKeywords.some(keyword => text.includes(keyword))) {
    message.say(`@${sender.name()} 本群禁止发广告，警告一次！`)
  }
}

/**
 * 其他类型的消息也可以强制获取text 从标题侦测
 * @param bot
 * @param message
 * @returns {Promise<void>}
 */
async function onMsg (bot, message) {
  const room = await message.room()
  const self = bot.userSelf()
  const alias = await room.alias(self)
  // 群备注用.开头禁止检测广告
  if (alias && alias.startsWith('.')) {
    return
  }
  // 管理员除外
  if (await isAdmin(message)) return
  await onText(bot, message)
}

module.exports = {
  onText,
  onMsg
}
