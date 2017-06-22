const express = require('express')
const router = express.Router()

const locals = require('../views/locals/')

router.get('/', (req, res) => {
  res.render('index', Object.assign({ session: req.session }, locals))
})

module.exports = router

