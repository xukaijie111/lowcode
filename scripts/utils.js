const fs = require('fs')
const chalk = require('chalk')

const allTargets = (exports.allTargets = fs.readdirSync('packages').filter(f => {
  if (!fs.statSync(`packages/${f}`).isDirectory()) {
    return false
  }
  const pkg = require(`../packages/${f}/package.json`)
  if (pkg.private) {
    return false
  }
  return true
}))


const targets =  (exports.targets = fs.readdirSync('packages').filter(f => {
  if (!fs.statSync(`packages/${f}`).isDirectory()) {
    return false
  }
  return true
}))