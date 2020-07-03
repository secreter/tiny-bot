const config = require('../config')
const { sleep } = require('../lib/utils')
async function isAdmin (message) {
  const sender = message.from()
  const alias = await sender.alias()
  if (!alias || !/[\s\S]*管理员$/.test(alias)) return false
  return true
}

async function isSuperAdmin (message) {
  const sender = message.from()
  const alias = await sender.alias()
  if (!alias || !/[\s\S]*超级管理员$/.test(alias)) return false
  return true
}

async function onCommonText (bot, message) {

}

async function onAdminText (bot, message) {
  const text = message.text()
  switch (text) {

  }
  return -1
}

async function onSuperAdminText (bot, message) {
  const text = message.text()
  const receiver = message.to()
  const sender = message.from()
  const filehelper = bot.Contact.load('filehelper')
  let target = message
  if (receiver.id === 'filehelper') {
    target = filehelper // 要区分，之后用target
    // avoid loop response
    if (sender.id === 'filehelper') {
      return
    }
  }
  switch (text) {
    case 'config':
      let status = {
        schedule: config.schedule,
        friend: config.friend,
        room: config.room
      }
      return await target.say(JSON.stringify(status), null, 2)
    case '菜单':
      return await target.say(
        'config \n' +
        '打开/关闭特别关注\n' +
        '打开/关闭接受好友\n' +
        '打开/关闭欢迎语\n' +
        '打开/关闭聊天\n' +
        '打开/关闭群转发\n' +
        '添加/移除特别关注xxx\n' +
        '添加/移除转发从群xxx\n' +
        '设置主群xxx\n' +
        '设置主播xxx(昵称)\n' +
        '广播【xxx正则】xxxx\n' +
        '转发:xxx/xxx群（群名称）\n'
      )
  }
  if (/^开启(.*)/.test(text)) {
    const matches = text.match(/^开启(.*)/)
    const keyword = matches[1]
    switch (keyword) {
      case '接受好友':
        config.friend.accept = true
        break
      case '聊天':
        config.room.chat = true
        break
      case '欢迎语':
        config.room.welcome = true
        break
      case '特别关注':
        config.friend.monitor = true
        break
      case '群转发':
        config.room.forward = true
        break
    }
    return await target.say('开启成功！')
  } else if (/^关闭(.*)/.test(text)) {
    const matches = text.match(/^关闭(.*)/)
    const keyword = matches[1]
    switch (keyword) {
      case '接受好友':
        config.friend.accept = false
        break
      case '聊天':
        config.room.chat = false
        break
      case '欢迎语':
        config.room.welcome = false
        break
      case '特别关注':
        config.friend.monitor = false
        break
      case '群转发':
        config.room.forward = false
        break
    }
    return await target.say('关闭成功！')
  } else if (/^添加(.*)/.test(text)) {
    if (/^添加特别关注(.*)/.test(text)) {
      const matches = text.match(/^添加特别关注(.*)/)
      const alias = matches[1]
      if (!config.friend.monitorList.includes(alias)) {
        config.friend.monitorList.push(alias)
      }
    } else if (/^添加转发从群(.*)/.test(text)) {
      const matches = text.match(/^添加转发从群(.*)/)
      const topic = matches[1]
      if (!config.room.forwardList.includes(topic)) {
        config.room.forwardList.push(topic)
      }
    }
    return await target.say('添加成功！')
  } else if (/^移除(.*)/.test(text)) {
    if (/^移除特别关注(.*)/.test(text)) {
      const matches = text.match(/^移除特别关注(.*)/)
      const alias = matches[1]
      let index
      if ((index = config.friend.monitorList.indexOf(alias)) !== -1) {
        config.friend.monitorList.splice(index, 1)
      }
    } else if (/^移除转发从群(.*)/.test(text)) {
      const matches = text.match(/^移除转发从群(.*)/)
      const topic = matches[1]
      let index
      if ((index = config.room.forwardList.indexOf(topic)) !== -1) {
        config.room.forwardList.splice(index, 1)
      }
    }
    return await target.say('移除成功！')
  } else if (/^设置(.*)/.test(text)) {
    if (/^设置主群(.*)/.test(text)) {
      const matches = text.match(/^设置主群(.*)/)
      config.room.forwardMain = matches[1]
    } else if (/^设置主播(.*)/.test(text)) {
      const matches = text.match(/^设置主播(.*)/)
      config.room.forwardPerson = matches[1]
    }
    return await target.say('设置成功！')
  } else if (/^广播【([\s\S]+)】\s*([\s\S]+)/.test(text)) {
    // 广播群功能
    const matches = text.match(/^广播【([\s\S]+)】\s*([\s\S]+)/)
    let reg = new RegExp(matches[1])
    let rooms = await bot.Room.findAll({ topic: reg })
    if (!rooms) return
    for (let i = 0; i < rooms.length; i++) {
      await rooms[i].say(matches[2])
      await sleep(2000)
    }
  }
  return -1
}
async function onRoomAdminText (bot, message) {
  // 获取@之后的信息
  let text = ''
  const room = message.room()
  if (await message.mentionSelf()) {
    text = message.text().split('\u2005').splice(1).join('\u2005')
  }
  const self = bot.userSelf()
  switch (text) {

  }
  if (/^移出@([\s\S]+)\u2005?/.test(text)) {
    // 踢人
    const matches = text.match(/^移出@([\s\S]+)\u2005?/)
    const nickname = matches[1]
    const member = await room.member({ name: nickname })
    if (!member) return
    try {
      await room.del(member)
      await message.say(`已经移出${nickname}`) // 网页版不能用了
    } catch (e) {
      console.error(e)
    }
  }
  return -1
}

/**
 * 处理所有类型的消息
 * @param bot
 * @param message
 * @returns {Promise<void>}
 */
async function onRoomAdminMsg (bot, message) {
  // 转发群消息
  if (await forward(bot, message) !== -1) return
  return -1
}

/**
 * 群名称为 转发:xxx/aaa的就转发到群xxx、aaa
 * @param bot
 * @param message
 * @returns {Promise<void>}
 */
async function forward (bot, message) {
  const topic = await message.room().topic()
  if (!/转发:(.*)/.test(topic)) return
  let str = topic.slice(3)
  let topics = str.split('/')
  let to
  for (let i = 0; i < topics.length; i++) {
    to = await bot.Room.find({ topic: new RegExp(topics[i]) })
    if (!to) continue
    await message.forward(to)
    await sleep(2000)
  }
  return -1
}

module.exports = {
  admin: {
    onText: onAdminText
  },
  superAdmin: {
    onText: onSuperAdminText
  },
  roomAdmin: {
    onText: onRoomAdminText,
    onMsg: onRoomAdminMsg
  },
  isAdmin,
  isSuperAdmin
}
