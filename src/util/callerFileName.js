'use strict'

const callsites = require('callsites')
const path = require('path')

module.exports = function (deep = 1) {
  return path.basename(callsites()[deep].getFileName(), '.js')
}
