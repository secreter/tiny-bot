const { getRandomPhoto, searchPhoto } = require('../api/unsplash')
const { getTodayConstellation } = require('../api/constellation')
const { log, UrlLink, MiniProgram } = require('wechaty')
const { FileBox } = require('wechaty-puppet')
const { screenShotApi, moodApi } = require('../config')
// const FileBox = require('file-box')

/**
 * friend、room common function
 * @param bot
 * @param message
 * @returns {Promise<*>}
 */
async function onText (bot, message) {
  // 获取@之后的信息
  let text = message.text().split('\u2005').pop()
  const self = bot.userSelf()
  let img
  switch (text) {
    case '图片':
      let info = await getRandomPhoto()
      // console.log(info.urls.small)
      img = FileBox.fromUrl(info.urls.small, 'reply.jpg')
      return await message.say(img)
    case '去哪玩':
    case '去哪儿玩':
      img = FileBox.fromUrl(`${screenShotApi}?url=${encodeURIComponent('https://beijing.douban.com/events/week-exhibition')}&y=200&x=0&h=2000&w=375&type=jpeg&quality=30`, 'reply.jpg')
      return message.say(img)
    case '菜单':
      await message.isAdmin()
      return message.say(
        '菜单 查看菜单\n' +
        'xx座 星座运势\n' +
        '去哪玩 查看周末活动\n' +
        '内推 进入互联网内推圈\n' +
        '打卡 生成打卡记录\n' +
        '优惠 同城店铺优惠信息\n' +
        '副业 分享副业信息\n' +
        // 'xx图片 图片搜索,建议英文\n' +
        '【xxx】 生成心情图片\n')
    case '优惠':
      const linkPayload = new UrlLink({
        description: '享受比美团点评高得多的优惠折扣',
        thumbnailUrl: 'http://images.redream.cn/upic/2019/20200628114125-KLc3DX.jpg',
        title: '城市生活周边优惠',
        url: 'https://cd-nt.lianlianlvyou.com/?v=296&i=wx0d2c74ae953fd08e&a=35193330#/zhoubian'
      })
      return message.say(linkPayload)
    case '赚钱':
      const linkPayload2 = new UrlLink({
        description: '类似美团点评，但折扣力度大很多。注册店铺后，只要有用户从你的店铺下单消费，即可获得佣金。',
        thumbnailUrl: 'http://images.redream.cn/upic/2019/20200628120121-mhq92Y.jpg',
        title: '连连周边游折扣店铺注册',
        url: 'https://cd-nt.lianlianlvyou.com/?l=0&from=timeline&v=296&i=wx0d2c74ae953fd08e#/mine/35193330/vip/info'
      })
      // http://music.163.com/song/media/outer/url?id=30245655.mp3
      return message.say(linkPayload2)
    case '内推':
      const miniProgram = new MiniProgram({
        username: 'gh_50115bd27682@app', // get from mp.weixin.qq.com
        appid: 'wxb036cafe2994d7d0',
        title: '微信互联网内推圈', // optional
        pagePath: 'portal/group-profile/group-profile.html?group_id=13104377799395168&invite_ticket=BgAAbWo8hB_kJKBVbh3zAOnogc0j4iFn18OqNYl_SttLJL4trmByi_O830a80xp5UMQv1SDt&fromScene=chat&preScene=group-manage', // optional
        description: 'hh', // optional
        thumbnailUrl: '30640201000458305602010002049bc601db02032f4f560204197bc2dc02045ef765e004316175706170706d73675f636535663530363561626134346435385f313539333237313737353730385f31303939363331300204010400030201000405004c54a200', // optional
        thumbKey: 'bd2044a3301078280276348b763463e9'
      })
      return message.say(miniProgram)
    case '#ding':
      return message.say('dong')
    case '打卡':
      await message.say(`${message.from().name()}打卡成功`)
      return message.say(FileBox.fromUrl(`${screenShotApi}?url=http%3A%2F%2Fimages.redream.cn%2Fupic%2F2019%2F20200629184711-punch.html%3Fdata%3D%5B%7B"count"%3A1%2C"timestamp"%3A1593097495015%7D%2C%7B"count"%3A1%2C"timestamp"%3A1593270295015%7D%2C%7B"count"%3A1%2C"timestamp"%3A1593339046223%7D%2C%7B"count"%3A1%2C"timestamp"%3A1593427696584%7D%2C%7B"count"%3A1%2C"timestamp"%3A1593521084178%7D%2C%7B"count"%3A1%2C"timestamp"%3A1593574357851%7D%2C%7B"count"%3A1%2C"timestamp"%3A1593688908645%7D%2C%7B"count"%3A1%2C"timestamp"%3A1593705938358%7D%5D%26avatar%3Dhttp%3A%2F%2Fwx.qlogo.cn%2Fmmhead%2Fver_1%2FOeKicM5TibegS3iaUtdbwFwzQia16QftEgzLuNR2ib5dicH0ka4bTAotbH8phSibTAKjh8derOHCh7qcPQhic1qnEibFlNW29z2ebqrn7gRpR9lgOicCM%2F132%26name%3D%402020&&h=450&w=375&x=0&y=0`, 'chart.png'))
    case '加群':
      let room = await bot.Contact.find({ name: /@2019/ })
      return message.say(room)
  }

  // 正则匹配
  if (/(.+)图片\s*$/i.test(text)) {
    // 图片检索
    const matches = text.match(/(.+)图片\s*$/i)
    const keyword = matches[1]
    const info = await searchPhoto(keyword)
    if (!info) return await message.say('没有检索到图片，试试英文关键字吧！')
    img = FileBox.fromUrl(info.urls.small, 'reply.jpg')
    return await message.say(img)
  } else if (/(白羊|金牛|双子|巨蟹|狮子|处女|天秤|天蝎|射手|摩羯|水瓶|双鱼)座?$/.test(text)) {
    // 星座运势
    if (text.length === 2) {
      text = text + '座'
    }
    const reply = await getTodayConstellation(text)
    return await message.say(reply)
  } else if (/【([\s\S]+)】$/.test(text)) {
    // 心情图片
    const matches = text.match(/【([\s\S]+)】$/)
    const words = matches[1]
    img = FileBox.fromUrl(`${moodApi}?rate=0.8&userword=${encodeURIComponent(words)}`, 'reply.jpg')
    return message.say(img)
  }
  return -1 // 表示没有处理过
}

module.exports = {
  onText
}
