const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')

const app = express()

const CONFIG = require('./config.js')
const production = app.get('env') === 'production'

app.set('view engine', 'pug')
app.set('views', __dirname + '/views')

if(production) {
  require('longjohn')
  app.disable('view cache')
  app.use(require('morgan')('dev'))
}

app.use(session({
  secret: CONFIG.SESS_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 60},
}))

app.use(bodyParser.json())

app.use('/', require('./routes/index.js'))
app.use(express.static(__dirname + app.get('env') === 'production' ? 'build': 'public'))

module.exports = app

