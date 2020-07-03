/**
 * Created by pengchaoyang on 2019/1/31
 */
const config = require('../config')
module.exports = async function onRoomJoin (bot, room, inviteeList, inviter) {
  if (!config.room.welcome) return
  const self = bot.userSelf()
  const alias = await room.alias(self)
  // 群备注用.开头禁止欢迎
  if (alias && alias.startsWith('.')) {
    return
  }
  const inviteeName = inviteeList.map(c => c.name()).join(', ')
  // 如果机器人被拉到一个新的群组里, inviteeList[0] === bot.self()
  if (inviteeList[0] === bot.self()) {
    await room.say(`大家好呀，欢迎来撩哈哈哈`)
  } else {
    // 可能会邀请多人
    await room.say(`@${inviteeName} 欢迎入群`)
  }
}
