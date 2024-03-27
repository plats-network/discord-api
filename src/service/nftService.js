const axios = require("axios");
const DB = require("../helpers/connect-db");
const { Abi, ContractPromise } = require("@polkadot/api-contract");
const { ApiPromise, WsProvider, Keyring } = require("@polkadot/api");
const { BN, BN_ONE } = require("@polkadot/util");
require("dotenv").config();
const metadata = require("../abi/psp34");
const {
  signAndSend,
  signCertificate,
  OnChainRegistry,
  options,
  PinkContractPromise,
  PinkCodePromise,
} = require("@phala/sdk");

const { END_POINT, AZERO_TESTNET, ASTAR_TESTNET, PHALA_TESTNET } = require("../utils/constant");
const MAX_CALL_WEIGHT = new BN(500_000_000_000).isub(BN_ONE);
const PROOFSIZE = new BN(1_000_000);

class NFTService {
  static check = async ({ accountAddress, nftAddress, network }) => {
    const api = await this.connectApi(network);
    const gasLimit = api.registry.createType("WeightV2", {
      refTime: MAX_CALL_WEIGHT,
      proofSize: PROOFSIZE,
    });

    let balance;
    if (network === AZERO_TESTNET || network === ASTAR_TESTNET) {
      const abi = new Abi(metadata, api.registry.getChainProperties());
      const contract = new ContractPromise(api, abi, nftAddress);
      balance = await this.getBalanceOf(contract, gasLimit, accountAddress);
    } else if (network === PHALA_TESTNET) {
      const api = await this.connectApi(network);
      const phatRegistry = await OnChainRegistry.create(api);
      const contractKey = await phatRegistry.getContractKeyOrFail(nftAddress);
      const contract = new PinkContractPromise(api, phatRegistry, metadata, nftAddress, contractKey);
      // sign to certificate for account
      // phần này e cần thực hiện trước khi mà call api này
      const cert = await this.getCertificate(api);
      balance = await this.getBalanceOf(contract, gasLimit, cert, accountAddress);
    } else {
      return {
        code: 404,
        message: "Network id not support",
      }
    }

    console.log({ balance });

    if (balance > 0) {
      return {
        code: 200,
        data: true
      }
    } else {
      return {
        code: 200,
        data: false
      }
    }
  };

  static getBalanceOf = async (contract, gasLimit, cert, accountAddress) => {
    const { result, output } = await contract.query["psp34::balanceOf"](
      accountAddress,
      {
        gasLimit: gasLimit,
        storageDepositLimit: null,
        cert,
      },
      accountAddress
    );

    if (result.isOk) {
      // output the return value
      const balance = JSON.parse(output.toString());
      return Number(balance.ok);
    } else {
      throw Error(error.message);
    }
  };

  static getContractMetadata = async (addressContract) => {
    const data = {
      contract: addressContract,
    };
    try {
      const response = await axios.post(process.env.SUBSCAN_ALEPH_GET_CONTRACT_META_API, data);
      return response.data;
    } catch (error) {
      return null;
    }
  };

  static getCertificate = async (api) => {
    const account_private = process.env.PHALA_ACCOUNT;

    const keyring = new Keyring({ ss58Format: 30, type: "sr25519" });
    const pair = keyring.addFromUri(account_private);
    const cert = await signCertificate({ pair });
    return cert;
  };

  static connectApi = async (network) => {
    var api;
    // Aleph Mainnet
    if (network == AZERO_TESTNET || network === ASTAR_TESTNET) {
      console.log(END_POINT[network]);
      const provider = new WsProvider(END_POINT[network]);
      api = await ApiPromise.create({ provider });
      console.log("Connected to Aleph Mainnet");
    }
    // Phala Testnet
    else if (network === PHALA_TESTNET) {
      const provider = new WsProvider(process.env.PHALA_TESTNET_ENDPOINT);
      api = await ApiPromise.create(options({ provider, noInitWarn: true }));
      console.log("Connected to Phala Testnet");
    }

    return api;
  };
}

module.exports = NFTService;
