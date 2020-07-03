const QrcodeTerminal = require('qrcode-terminal')
const { ScanStatus } = require('wechaty-puppet')

module.exports = async function onScan (qrcode, status) {
  if (status === ScanStatus.Waiting) {
    QrcodeTerminal.generate(qrcode, {
      small: true
    })
  }
}
