const process = require('process')
const path = require('path')
const manifest = require(__dirname + '/../../manifest.json')

module.exports = file => {
  if(process.env.NODE_ENV === 'development') return file

  const filename = path.basename(file)
  const dirname  = path.dirname(file)

  if (!(filename in manifest)) {
    console.error(`${file} not found in manifest`)
    return file
  }

  return path.join(dirname, manifest[filename])
}

