'use strict'

const { StatusCodes, ReasonPhrases } = require("../utils/httpStatusCode")

class SuccessResponse {
    constructor({ statusCode = StatusCodes.OK, message, reasonStatusCode = ReasonPhrases.OK, metadata = {} }) {
        this.message = message ? message : reasonStatusCode
        this.metadata = metadata
        this.status = statusCode
    }

    send(res, headers = {}) {
        return res.status(this.status).json(this)
    }
}

class OK extends SuccessResponse {
    constructor({ message, metadata }) {
        super({ message, metadata })
    }
}

class CREATED extends SuccessResponse {
    constructor({ statusCode = StatusCodes.CREATED, message, reasonStatusCode = ReasonPhrases.CREATED, metadata, options = {} }) {
        super({ statusCode, message, reasonStatusCode, metadata })
        this.options = options
    }
}

module.exports = {
    CREATED,
    OK,
    SuccessResponse
}