// const { PuppetPadplus } = require('wechaty-puppet-padplus')
const finis = require('finis')
const { Wechaty } = require('wechaty')
const { PuppetPadplus } = require('wechaty-puppet-padplus')
const onScan = require('./listeners/on-scan')
const onLogin = require('./listeners/on-login')
const onLogout = require('./listeners/on-logout')
const onMessage = require('./listeners/on-message')
const onFriend = require('./listeners/on-friend')
const onRoomInvite = require('./listeners/on-room-invite')
const onRoomJoin = require('./listeners/on-room-join')
const onRoomLeave = require('./listeners/on-room-leave')
const onRoomTopic = require('./listeners/on-room-topic')
const { inviteToRoom } = require('./lib/room')
const { token } = require('./config')
const puppet = new PuppetPadplus({
  token
})
const name = 'ted'

const bot = new Wechaty({
  // puppet: 'wechaty-puppet-hostie',
  // puppetOptions: {
  //   token
  // },
  puppet,
  name // generate xxxx.memory-card.json and save login data for the next login
})

async function main () {
  bot
    .on('scan', onScan)
    .on('login', onLogin.bind(null, bot))
    .on('logout', onLogout)
    .on('message', onMessage.bind(null, bot))
    .on('friendship', onFriend.bind(null, bot))
    .on('room-invite', onRoomInvite)
    .on('room-join', onRoomJoin.bind(null, bot))
    .on('room-leave', onRoomLeave)
    .on('room-topic', onRoomTopic)
    .start()
    .catch(async function (e) {
      console.log(`Init() fail: ${e}.`)
      await bot.stop()
      process.exit(1)
    })
}

main()

finis((code, signal, error) => {
  console.log('Importand data saved at this step.')

  // await bot.stop()
  bot.stop()
  console.log(`Wechaty exit ${code} because of ${signal}/${error})`)
  process.exit(1)
})
