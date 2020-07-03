const { msgInfo } = require('../lib/logger')
const { superAdmin } = require('../lib/admin')
const { FileBox } = require('file-box')
const QRCode = require('qrcode')
module.exports = async function onFileHelperMessage (bot, message) {
  const { Image, Emoticon, Video, Url, Text, Contact, Attachment, Unknown } = bot.Message.Type
  const filehelper = bot.Contact.load('filehelper')
  const sender = message.from()
  // avoid loop response
  if (sender.id === 'filehelper') {
    return
  }
  msgInfo(message)
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
    case Unknown:
      break
    default:
      break
  }
}
async function onText (bot, message) {
  const text = message.text()
  const self = bot.userSelf()
  const filehelper = bot.Contact.load('filehelper')
  if (await superAdmin.onText(bot, message) !== -1) return
  switch (text) {
    case 'qr':
      // Unsupported
      const qrcode = await self.qrcode()
      QRCode.toFile('./my.png', qrcode, {
        color: {
          dark: '#00F', // Blue dots
          light: '#0000' // Transparent background
        }
      }, function (err) {
        if (err) throw err
        console.log('done')
        const qrImg = FileBox.fromFile('./my.png')
        filehelper.say(qrImg).then(() => {})
      })
  }
}
