/**
 * 和filehelper 相同的权限
 */
const { msgInfo } = require('../lib/logger')
const { superAdmin } = require('../lib/admin')

module.exports = async function onSuperAdminMessage (bot, message) {
  const { Image, Emoticon, Video, Url, Text, Contact, Attachment, Unknown } = bot.Message.Type
  const sender = message.from()
  const receiver = message.to()

  msgInfo(message)
  switch (message.type()) {
    case Image:
      break
    case Emoticon:
      break
    case Video:
      break
    case Url:
      break
    case Text:
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
  return -1
}
async function onText (bot, message) {
  const text = message.text()
  const self = bot.userSelf()
  // common command
  if (await superAdmin.onText(bot, message) !== -1) return
  switch (text) {

  }
}
