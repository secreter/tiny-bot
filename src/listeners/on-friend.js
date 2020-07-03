
const { friend } = require('../config.js')
const { Friendship } = require('wechaty')

module.exports = async function onFriend (bot, friendship) {
  if (!friend.accept) return

  let logMsg
  const fileHelper = bot.Contact.load('filehelper')

  try {
    logMsg = 'received `friend` event from ' + friendship.contact().name()
    await fileHelper.say(logMsg)
    console.log(logMsg)

    switch (friendship.type()) {
      /**
       *
       * 1. New Friend Request
       *
       * when request is set, we can get verify message from `request.hello`,
       * and accept this request by `request.accept()`
       */
      case Friendship.Type.Receive:
        if (friendship.hello() === 'ding') {
          logMsg = 'accepted automatically because verify messsage is "ding"'
          console.log('before accept')
          await friendship.accept()
          console.log('after accept')
        } else {
          logMsg = 'not auto accepted, because verify message is: ' + friendship.hello()
        }
        break

      /**
       *
       * 2. Friend Ship Confirmed
       *
       */
      case Friendship.Type.Confirm:
        logMsg = 'friend ship confirmed with ' + friendship.contact().name()
        break
    }
  } catch (e) {
    logMsg = e.message
  }

  await fileHelper.say(logMsg)
}
