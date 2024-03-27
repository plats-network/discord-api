'use strict'
const { SuccessResponse } = require("../core/success.response")
const NFTService = require("../service/nftService")

class NFTController {
    check = async (req, res, next) => {
        const nftAddress = req.query.nftAddress;
        const accountAddress = req.query.accountAddress;
        const network = req.query.network;
        new SuccessResponse({
            metadata: await NFTService.check({ accountAddress, nftAddress, network })
        }).send(res)
    }
}

module.exports = new NFTController()