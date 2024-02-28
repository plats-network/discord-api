const axios = require("axios");
const DB = require("../helpers/connect-db");
const { Abi, ContractPromise } = require("@polkadot/api-contract");
const { ApiPromise, WsProvider } = require("@polkadot/api");
const { BN, BN_ONE } = require("@polkadot/util");
require("dotenv").config();
const metadata = require("../abi/psp34");

const bodyParser = require("body-parser");
const USER_NOT_OWNER_NFT = "5DqEmEVJNb6wLApzqibkpdpYtGHGb7aLZYaEhDy69QmSoUJ4";
const USER_OWNER_NFT = "5FPAD1gvJBdV9icnrar6zqjyCEWZPdBfdaqKD38gbvpcZu86";
const MAX_CALL_WEIGHT = new BN(500_000_000_000).isub(BN_ONE);
const PROOFSIZE = new BN(1_000_000);

class NFTService {
  static check = async ({ accountAddress, nftAddress }) => {
    let response = await this.getContractMetadata(nftAddress); // Sửa đổi ở đây
    if (!response) {
      return {
        message: "Contract Address is not existing",
      };
    }
    const provider = new WsProvider(process.env.ALEPH_TESTNET_ENDPOINT);
    const api = await ApiPromise.create({ provider });
    const abi = new Abi(metadata, api.registry.getChainProperties());

    const gasLimit = api.registry.createType("WeightV2", {
      refTime: MAX_CALL_WEIGHT,
      proofSize: PROOFSIZE,
    });

    const contract = new ContractPromise(api, abi, nftAddress);

    let balance = await this.getBalanceOf(contract, gasLimit, accountAddress); // Sửa đổi ở đây

    if (balance > 0) {
      return {
        data: true,
      };
    } else {
      return {
        data: false,
      };
    }
  };

  static getBalanceOf = async (contract, gasLimit, accountAddress) => {
    const { result, output } = await contract.query["psp34::balanceOf"](
      accountAddress,
      {
        gasLimit: gasLimit,
        storageDepositLimit: null,
      },
      accountAddress
    );

    if (result.isOk) {
      // output the return value
      const balance = JSON.parse(output.toString());
      return Number(balance.ok);
    } else {
      console.error("Error", result.asErr);
    }
  };

  static getContractMetadata = async (addressContract) => {
    console.log(addressContract);

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
}

module.exports = NFTService;
