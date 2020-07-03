/**
 * Created by pengchaoyang on 2019/1/31
 */
const path = require('path')
const fs = require('fs')
const mkdirp = require('mkdirp')
async function saveMediaFile (message, filePath = './') {
  if (!fs.existsSync(filePath)) {
    mkdirp.sync(path.resolve(filePath))
  }

  const file = await message.toFileBox()
  const filename = path.resolve(filePath, file.name)
  console.log('Save file to: ' + filename)
  await file.toFile(filename)
}

module.exports = {
  saveMediaFile
}
