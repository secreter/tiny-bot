/**
 * 和filehelper 相同的权限
 */
const { msgInfo } = require('../lib/logger')
const { roomAdmin } = require('../lib/admin')
module.exports = async function onRoomAdminMessage (bot, message) {
  const { Image, Emoticon, Video, Url, Text, Contact, Attachment, Unknown } = bot.Message.Type
  const sender = message.from()
  const receiver = message.to()
  // avoid loop response
  if (sender.id === 'filehelper') {
    return
  }
  msgInfo(message)
  // 优先处理管理员消息
  if (await roomAdmin.onMsg(bot, message) !== -1) return
  switch (message.type()) {
    case Image:
      // saveMediaFile(message, config.filePath)
      break
    case Emoticon:
      break
    case Video:
      break
    case Url:
      break
    case Text:
      const text = message.text()
      await onText(bot, message)
      break
    case Contact:
      break
    case Attachment:
      break
    case Unknown:
      break
    default:
      break
  }
  return -1 // not match
}
async function onText (bot, message) {
  const text = message.text()
  const self = bot.userSelf()
  switch (text) {

  }
}
