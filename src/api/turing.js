/**
 * 图灵机器人
 * api https://www.kancloud.cn/turing/www-tuling123-com/718227
 */
const axios = require('axios')
const { turing } = require('../config')
async function request (text) {
  return axios({
    method: 'post',
    url: 'http://openapi.tuling123.com/openapi/api/v2',
    data: {
      'reqType': 0,
      'perception': {
        'inputText': {
          'text': text
        }
      },
      'userInfo': {
        'apiKey': turing.key,
        'userId': turing.secret
      }
    }
  })
}

/**
 * 只返回纯文本
 * @param text
 * @returns {Promise<*>}
 */
async function replyText (text) {
  const response = await request(text)
  const results = response.data.results
  if (!results) return '我不想说话了'
  const result = results.filter(item => item.resultType === 'text')
  if (result.length === 0) return '我不想说话了'
  return result[0].values.text
}

async function reply (text) {

}

module.exports = {
  replyText,
  reply
}
