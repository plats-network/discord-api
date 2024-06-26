const axios = require("axios");
const DB = require("../helpers/connect-db");
const { ContractPromise } = require("@polkadot/api-contract");
const { ApiPromise, WsProvider, Keyring } = require("@polkadot/api");
const {encodeAddress} = require('@polkadot/keyring');

const { BN, BN_ONE } = require("@polkadot/util");
require("dotenv").config();
const metadata = require("../abi/psp34");
const {
  signCertificate,
  OnChainRegistry,
  options,
  PinkContractPromise,
} = require("@phala/sdk");

const { END_POINT, AZERO_TESTNET, ASTAR_TESTNET, PHALA_TESTNET } = require("../utils/constant");
const MAX_CALL_WEIGHT = new BN(500_000_000_000).isub(BN_ONE);
const PROOFSIZE = new BN(1_000_000);

class NFTService {
  static check = async ({ accountAddress, nftAddress, network }) => {
    accountAddress = this.convertAddress(accountAddress, network);
    const api = await this.connectApi(network);
    const gasLimit = api.registry.createType("WeightV2", {
      refTime: MAX_CALL_WEIGHT,
      proofSize: PROOFSIZE,
    });

    let balance;
    if (network === AZERO_TESTNET || network === ASTAR_TESTNET) {

      const contract = new ContractPromise(api, metadata, nftAddress);
      balance = await this.getBalanceOf(contract, gasLimit, accountAddress);

    } else if (network === PHALA_TESTNET) {

      const api = await this.connectApi(network);
      const phatRegistry = await OnChainRegistry.create(api);
      const contractKey = await phatRegistry.getContractKeyOrFail(nftAddress);
      const contract = new PinkContractPromise(api, phatRegistry, metadata, nftAddress, contractKey);
      // sign to certificate for account
      // phần này e cần thực hiện trước khi mà call api này
      const cert = await this.getCertificate(api);
      balance = await this.getBalanceOfPhala(contract, gasLimit, cert, accountAddress);
    } else {
      return {
        code: 404,
        message: "Network id not support",
      }
    }

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

  static getBalanceOf = async (contract, gasLimit, accountAddress) => {
    const { result, output } = await contract.query["psp34::balanceOf"](
      accountAddress,
      {
        gasLimit: gasLimit,
        storageDepositLimit: null
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

  static getBalanceOfPhala = async (contract, gasLimit,cert, accountId) => {
    const { result, output } = await contract.query['psp34::balanceOf'](
        accountId,
        {
            gasLimit: gasLimit,
            storageDepositLimit: null,
            cert
        }, accountId
    );
    if (result.isOk) {
        // output the return value
        const balance = JSON.parse(output.toString());
        return Number(balance.ok)
    } else {
      throw Error(error.message);
    }
}


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

  static convertAddress = (accountAddress, network) => {
    let address = ""
    if (network === AZERO_TESTNET) {
        address = encodeAddress(accountAddress, 42);
    } else if (network === ASTAR_TESTNET) {
        address = encodeAddress(accountAddress, 5);
    }
    else if (network === PHALA_TESTNET) {
        address = encodeAddress(accountAddress, 30);
    }
    return address;
}
}

module.exports = NFTService;
