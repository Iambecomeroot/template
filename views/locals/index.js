const fs = require('fs')
const path = require('path')

fs.readdirSync(__dirname).forEach(file => {
  const basename = path.basename(file)
  const extname = path.extname(file)
  const name = basename.substr(0, basename.length - extname.length)

  if (name === 'index') return
  if (extname !== '.js') return

  module.exports[name] = require(path.join(__dirname, basename))
})

