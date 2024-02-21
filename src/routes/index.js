'use strict'

const express = require('express')
const router = express.Router()

router.use('/api', require('./auth-discord'))
router.use('/api', require('./verify-join-discord'))
router.use('/api', require('./check-nft'))

module.exports = router