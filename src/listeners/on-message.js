const onFriendMessage = require('./on-friend-message')
const onRoomMessage = require('./on-room-message')
const { log } = require('wechaty')

module.exports = async function onMessage (bot, message) {
  try {
    if (message.room() === null) onFriendMessage(bot, message)
    else onRoomMessage(bot, message)
  } catch (e) {
    log.error('Bot', 'on(message) exception: %s', e)
  }
}
