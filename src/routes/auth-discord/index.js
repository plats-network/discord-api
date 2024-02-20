'use strict'

const express = require('express')
const { asyncHandler } = require('../../helpers/asyncHandler')
const discordController = require('../../controllers/discordController')
const router = express.Router()

router.get('/auth/discord/redirect', asyncHandler(discordController.auth))

module.exports = router