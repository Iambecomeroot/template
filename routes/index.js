'use strict'

const express  = require('express')
const router   = express.Router()
const mongoose = require('mongoose')
const q        = require('q')

router.get('/', (req, res, next) => {
  res.render('index', {session: req.session})
})

module.exports = router
