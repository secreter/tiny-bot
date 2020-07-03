/**
 * Created by pengchaoyang on 2019/1/31
 */
const config = require('../config')
const onRoomMention = require('./on-room-mention')
const { sleep } = require('../lib/utils')
const { isAdmin } = require('../lib/admin')
const onRoomAdminMessage = require('./on-room-admin-message')
const adDetect = require('../lib/adDetect')
const { configForward, jobForward } = require('../lib/forward')
const friend = config.friend

module.exports = async function onRoomMessage (bot, message) {
  const { Image, Emoticon, Video, Url, Text, Contact, Attachment, MiniProgram, UrlLink, Unknown } = bot.Message.Type
  const room = message.room()
  const sender = message.from()
  const roomName = room ? `[${await room.topic()}] ` : ''
  if (await isAdmin(message)) {
    await onRoomAdminMessage(bot, message)
  }
  // 转发主播消息
  await configForward(bot, message)
  // 转发工作消息
  await jobForward(bot, message)

  if (message.self()) {
    return // skip self
  }
  if (await message.mentionSelf()) {
    console.log('this message were mentioned me! [You were mentioned] tip ([有人@我]的提示)')
    await onRoomMention(bot, message, room)
  }

  await adDetect.onMsg(bot, message) // 监控广告
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
      await onText(bot, message)
      break
    case Contact:
      break
    case Attachment:
      break
    case UrlLink:
      console.log(message)
      break
    case MiniProgram:
      console.log(message)
      break
    case Unknown:
      await message.forward(await bot.Room.find({ topic: /机器人管理员/ }))
      break
    default:
      break
  }
}

async function onText (bot, message) {
  console.log(message.from(), message.text(), message.room())
  // await adDetect.onText(bot, message) // 监控广告
  await monitorSomeOne(bot, message) // 特别关注
}

/**
 * 特别关注
 * @param bot
 * @param message
 * @returns {Promise<void>}
 */
async function monitorSomeOne (bot, message) {
  const sender = message.from()
  const text = message.text()
  const room = message.room()
  const topic = await room.topic()
  const senderName = await sender.alias() || await sender.name() // 优先备注
  // 转发特别关注的消息
  if (friend.monitor && friend.monitorList.includes(senderName)) {
    let to
    if (friend.monitorAccept) {
      to = await bot.Contact.find({ name: friend.monitorAccept })
    }
    if (!to) {
      // 默认是filehelper
      to = bot.Contact.load('filehelper')
    }
    // await message.forward(to)
    await to.say(
      `【${senderName}】\n` +
      `在【${topic}】说: \n` +
      `${text}`)
  }
}
