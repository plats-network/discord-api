require("dotenv").config();

module.exports = {
    AZERO_TESTNET: "azero-testnet",
    ASTAR_TESTNET: "astar-testnet",
    PHALA_TESTNET: "phala-testnet",
   END_POINT: {
    "azero-testnet": process.env.ALEPH_TESTNET_ENDPOINT,
    "astar-testnet": process.env.ASTAR_TESTNET_ENDPOINT,
    "phala-testnet": process.env.PHALA_TESTNET_ENDPOINT
   }
}