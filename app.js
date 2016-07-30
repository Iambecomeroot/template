'use strict'


//
// Built in
//

const http         = require('http')
const fs           = require('fs')
const path         = require('path')
const process      = require('process')


//
// External
//

// const _            = require('./functions/lodash.js')
const express      = require('express')
const bodyParser   = require('body-parser')
const session      = require('express-session')
const compression  = require('compression')
const mongoose     = require('mongoose')
const MongoStore   = require('connect-mongo')(session)


//
// Internal
//

const app          = express()

// Set up mongo
mongoose.Promise   = global.Promise
mongoose.connect('mongodb://localhost:27017/velo')

// Set up views
app.set('view engine', 'pug')
app.set('views', __dirname + '/views')

// Set up logging
if(app.get('env') === 'development'){
  app.use(require('morgan')('dev'))
}

// Use compression
app.use(compression({ filter: shouldCompress }))

// Set up sessions
app.use(session({
  secret: process.env.SESS_SECRET,
  resave: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  saveUninitialized: false,
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 60},
}))

// Set cache headers
app.use((req, res, next) => {
  const extension = path.extname(req.url)
  if(['js', 'css', 'svg', 'jpg'].indexOf(`.${extension}`) >= 0){
    res.setHeader("Cache-Control", "max-age=31536000")
  }else{
    res.setHeader("Cache-Control", "max-age=604800")
  }
  return next()
})

// Form data stuff
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// Set path for assets
app.use(express.static(__dirname + '/public'))

// app.use(favicon(__dirname + '/public/favicon.png'))
// app.use('/', require('./routes/auth.js'))

// Ensure user object exists in session
app.use((req, res, next) => {
  if(typeof req.session.user === 'undefined') req.session.user = {};
  next();
});

app.use('/', require('./routes/auth.js'))
app.use('/', require('./routes/index.js'))

// app.use('/', require('./routes/settings.js'))

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})


module.exports = app

function shouldCompress(req, res) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false
  }

  // fallback to standard filter function
  return compression.filter(req, res)
}
