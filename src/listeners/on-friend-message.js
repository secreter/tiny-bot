/**
 * Created by pengchaoyang on 2019/1/31
 */
const { msgInfo } = require('../lib/logger')
const onFileHelperMessage = require('./on-filehelper-message')
const { log } = require('wechaty')
const common = require('../lib/common')
const { isSuperAdmin } = require('../lib/admin')
const onSuperAdminMessage = require('./on-superadmin-message')

module.exports = async function onFriendMessage (bot, message) {
  const { Image, UrlLink, Emoticon, Video, Url, Text, Contact, Attachment, Unknown } = bot.Message.Type
  const sender = message.from()
  const receiver = message.to()

  if (receiver.id === 'filehelper') {
    return await onFileHelperMessage.call(null, bot, message)
  }
  if (message.self()) {
    return // skip self
  }
  if (await isSuperAdmin(message) && await onSuperAdminMessage(bot, message) !== -1) {
    return
  }
  msgInfo(message)
  console.log(message)
  const a = message.text()
  log.info(a)
  switch (message.type()) {
    case Image:
      break
    case Emoticon:
      break
    case Video:
      break
    case Url:
      // await message.forward(await bot.Room.find({ topic: /机器人管理员/ }))
      break
    case UrlLink:
      console.log(message)
      await message.forward(await bot.Room.find({ topic: /机器人管理员/ }))

      break
    case Text:
      const text = message.text()
      log.info(text)
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
}
async function onText (bot, message) {
  await common.onText(bot, message)
}
