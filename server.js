const app = require("./src/app");
const discord_bot = require("./src/index");
const dotenv = require('dotenv')
dotenv.config()

const server = app.listen(process.env.PORT, () => {
    console.log(`running server ${process.env.PORT}`)
})

process.on('SIGINT', () => {
    server.close(() => console.log('Exit Server Express'))
})