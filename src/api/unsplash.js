/**
 * 图片的的检索和查询
 */
const Unsplash = require('unsplash-js').default
const { toJson } = require('unsplash-js')
global.fetch = require('node-fetch')
const _ = require('lodash')
const config = require('../config')

const unsplash = new Unsplash({
  ...config.unsplash,
  callbackUrl: 'http://127.0.0.1' || 'http://unsplash-js.herokuapp.com'
})

/**
 * 随机返回一张图片的链接和描述
 * @returns {Promise<{description: *, urls: string | string[]}>}
 */
async function getRandomPhoto () {
  let res = await unsplash.photos.getRandomPhoto()
  let json = await toJson(res)
  return {
    description: json.description,
    urls: json.urls
  }
}

/**
 * 检索图片并返回一个链接
 * @param keyword
 * @param page
 * @param per_page
 * @returns {Promise<{description: *, urls: string | string[]}>}
 * urls {raw,full,small,thumb}
 */
async function searchPhoto (keyword, page = 1, per_page = 10) {
  let res = await unsplash.search.photos(keyword, page, per_page)
  let json = await toJson(res) // { total: 0, total_pages: 0, results: [] }
  if (json.total === 0) return null // no result
  const index = _.random(0, json.results.length - 1)
  return {
    description: json.results[index].description,
    urls: json.results[index].urls
  }
}
module.exports = {
  unsplash,
  photos: unsplash.photos,
  getRandomPhoto,
  searchPhoto
}
