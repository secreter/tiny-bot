const { replyText } = require('../api/turing')
const common = require('../lib/common')
const { msgInfo } = require('../lib/logger')
const { roomAdmin } = require('../lib/admin')
const config = require('../config')

/**
 * 被@ 只可能是text
 * @param bot
 * @param message
 * @param room
 * @returns {Promise<void>}
 */
module.exports = async function onRoomMention (bot, message, room) {
  msgInfo(message)
  await onText(bot, message, room)
}

async function onText (bot, message, room) {
  const sender = message.from()
  // 获取@之后的信息
  const text = await message.mentionText()
  if (await roomAdmin.onText(bot, message) !== -1) return
  if (await common.onText(bot, message) !== -1) return
  if (!config.room.chat) return // 关闭聊天
  const reply = await replyText(text)
  room.say(`@${sender.name()} ${reply}`)
}
