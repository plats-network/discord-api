'use strict'

const express = require('express')
const { asyncHandler } = require('../../helpers/asyncHandler')
const discordController = require('../../controllers/discordController')
const router = express.Router()

router.post('/verify/discord/join-channel', asyncHandler(discordController.verifyJoinChanel))

module.exports = router