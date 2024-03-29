require("dotenv").config();

module.exports = {
    AZERO_TESTNET: "aleph_testnet",
    ASTAR_TESTNET: "astar_testnet",
    PHALA_TESTNET: "phala",
   END_POINT: {
    "aleph_testnet": process.env.ALEPH_TESTNET_ENDPOINT,
    "astar_testnet": process.env.ASTAR_TESTNET_ENDPOINT,
    "phala": process.env.PHALA_TESTNET_ENDPOINT
   }
}