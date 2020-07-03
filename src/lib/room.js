/**
 * Created by So on 2018/6/9.
 */
const { log, Room } = require('wechaty')
async function addToRoom (contact, room) {
  log.info('Bot', 'putInRoom(%s, %s)', contact.name(), await room.topic())
  try {
    await room.add(contact)
    contact.say('success!')
    setTimeout(
      _ => room.say('Welcome ', contact),
      10 * 1000
    )
  } catch (e) {
    log.error('Bot', 'putInRoom() exception: ' + e.stack)
  }
}

async function inviteToRoom (contact, topic) {
  let reg = new RegExp(topic, 'i')
  const targetRoom = await Room.find({ topic: reg })
  if (targetRoom) {
    /**
     * room found
     */
    log.info('Bot', 'onMessage: got targetRoom: %s', targetRoom.topic())

    if (targetRoom.has(contact)) {
      /**
       * speaker is already in room
       */
      log.info('Bot', 'onMessage: sender has already in targetRoom')
      contact.say('no need to ding again, because you are already in ding room')
    } else {
      /**
       * put speaker into room
       */
      log.info('Bot', 'onMessage: add sender(%s) to targetRoom(%s)', contact.name(), targetRoom.topic())
      await addToRoom(contact, targetRoom)
    }
  } else {
    /**
     * room not found
     */
    log.info('Bot', 'onMessage: targetRoom not found, try to create one')
    /**
     * create the ding room
     */
    /**
     * listen events from ding room
     */
  }
}

module.exports = {
  inviteToRoom
}
