/**
 * Created by pengchaoyang on 2019/1/31
 */
/**
 * 打印日志并且包含调用函数的函数名称
 * @param n 父函数的层级，默认1
 * @returns {Function}
 */
const log = (n = 1) => (...args) => {
  try {
    throw Error()
  } catch (e) {
    let matches, parentFnName
    const stack = e.stack.toString()
    const reg = /at (\S+)[\S\s]+?/g
    let num = n + 1 // exclude self fn name
    while ((matches = reg.exec(stack)) !== null && num-- > 0) {
      parentFnName = matches[1] === 'Object.<anonymous>' ? 'global' : matches[1]
    }
    console.log(`Log in fn <${parentFnName}>:`, ...args)
  }
}
const logUpTwo = log(2)
const msgInfo = (message) => {
  // const { Image, Emoticon, Video, Url, Text, Contact, Attachment, Unknown } = bot.Message.Type
  const sender = message.from()
  logUpTwo(`<${sender.name()}>(${message.type()}): `)
}

module.exports = {
  raw: log,
  msgInfo
}
