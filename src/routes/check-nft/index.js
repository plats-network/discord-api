'use strict'

const express = require('express')
const { asyncHandler } = require('../../helpers/asyncHandler')
const nftController = require('../../controllers/nftController')
const router = express.Router()

router.get('/auth/check-nft', asyncHandler(nftController.check))

module.exports = router