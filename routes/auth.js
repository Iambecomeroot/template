'use strict'

const express   = require('express')
const validator = require('validator')
const q         = require('q')
const mongoose  = require('mongoose')

const bcrypt    = require('bcrypt-as-promised')

const router    = express.Router()

const User      = mongoose.model('User', {
  email: String,
  hash: String,
  date: { type: Date, default: Date.now },
})

// Generate error message from error code
function genErrMsg(err){
  let msg = ''

  // If just string, keep it
  if(typeof err === 'string') return err
  // console.log(err)

  // If object with error code
  if('code' in err){
    console.log('lol')
    switch(err.code){
    }
  }
  throw err
  // if('message' in err) return err.message

  return msg
}

// JSON return when error occurs
function onError(res){
  return err => {
    if(!err) return
    res.send({
      success: false,
      message: genErrMsg(err)
    })
  }
}


//
// Login
//

router.post('/login', (req, res, next) => {

  // Generator manager
  q.async(function*(){
    const email    = req.body.email    || ''
    const password = req.body.password || ''

    // If stored email exists and is same as given email, must already be logged in
    if(req.session.user.email === email && typeof email !== 'undefined'){
      res.send({
        success: true
      })
      return
    }

    // If already signed in under different email
    if(req.session.signedIn) throw 'Already signed in under different user'

    // Get id and password from db
    const data = yield User.findOne({ email })

    // If no data, user must not exist
    if(!data) throw 'User does not exist'

    const hash = data.hash
    const id   = data._id

    // Check password against hash
    const passwordSuccess = yield bcrypt.compare(password, hash)

    // If wrong password
    if(!passwordSuccess) throw 'Incorrect password'

    // Save email and id to store
    req.session.user.email = email
    req.session.user.id    = id
    req.session.signedIn   = true

    res.send({
      success: true
    })

  })()
    .fail(onError(res))
    .done()
})


//
// Register
//

router.post('/register', (req, res, next) => {

  // Generator manager
  q.async(function*(){
    let email      = req.body.email    || ''
    const password = req.body.password || ''
    const confirm  = req.body.confirm  || ''

    if(password !== confirm) throw 'Passwords do not match'

    // If not valid email
    if(!validator.isEmail(email)) throw 'Invalid email address'

    // Check if user exists
    const exists = yield User.findOne({ email })
    if(exists) throw 'That email address has already been registered'

    // Normalize email
    email = validator.normalizeEmail(email)

    // Hash & salt password
    const hash = yield bcrypt.hash(password)

    // Store email and hash in db
    const data = yield new User({ email, hash }).save()

    // Save email and id to store
    req.session.user.email = email
    req.session.user.id    = data._id
    req.session.signedIn   = true

    res.send({
      success: true
    })
  })()
    .fail(onError(res))
    .done()
})

//
// Logout
//

router.post('/logout', (req, res, next) => {
  req.session.destroy(onError(res))
  res.redirect('/')
})

module.exports = router
