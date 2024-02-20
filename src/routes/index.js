'use strict'

const express = require('express')
const router = express.Router()

router.use('/api', require('./auth-discord'))
router.use('/api', require('./verify-join-discord'))

module.exports = router