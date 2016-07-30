const axios = require('axios')

const url  = document.getElementById('svg-loader').getAttribute('data-svg-url')
const $div = document.createElement('div')

axios(url).then(res => {
  $div.innerHTML = res.data
  document.body.insertBefore($div, document.childNodes[0])
})
