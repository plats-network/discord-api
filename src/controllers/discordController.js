'use strict'
const { CREATED, SuccessResponse } = require("../core/success.response")
const DiscordService = require("../service/discordService")

class DiscordController {
    auth = async (req, res, next) => {
        const { code } = req.query;
        new SuccessResponse({
            metadata: await DiscordService.oauth2(code)
        }).send(res)
    }

    verifyJoinChanel = async(req, res, next) => {
        const { id } = req.body;
        new SuccessResponse({
            metadata: await DiscordService.verifyJoinChanel(id)
        }).send(res)
    }
}

module.exports = new DiscordController()