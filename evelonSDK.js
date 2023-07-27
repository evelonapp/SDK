const { ethers } = require("ethers");
const axios = require("axios");
const FormData = require("form-data");
const EvelonAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getAllTokensByAddress",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "addresses",
            type: "address",
          },
          {
            internalType: "string",
            name: "tokenIdName",
            type: "string",
          },
          {
            internalType: "string",
            name: "tokenURI",
            type: "string",
          },
        ],
        internalType: "struct DERC721.NFTAddresses[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
class EvelonSDK {
  constructor(config) {
    this.apiKey = config.apiKey;

    if (!("apiKey" in config)) {
      throw TypeError("apiKey is missing");
    }
    if (!("chainId" in config)) {
      throw TypeError("chainId is missing");
    }

    if (config.chainId != 1287 && config.chainId != 80001) {
      throw TypeError("Invalid chain ID");
    }

    this.chainId = config.chainId;

    if (config.chainId == 1287) {
      this.contractAddress = "0x998dD9E97F8Eb8dE2bAc069b7BE1d694ed521f47";
      let provider = new ethers.JsonRpcProvider(
        "https://rpc.testnet.moonbeam.network"
      );

      this.contract = new ethers.Contract(
        this.contractAddress,
        EvelonAbi,
        provider
      );
    } else if (config.chainId == 80001) {
      this.contractAddress = "0x4a25E76323d1694299729A443c054841459280d1";
      let provider = new ethers.JsonRpcProvider(
        "https://rpc-mumbai.maticvigil.com/"
      );

      this.contract = new ethers.Contract(
        this.contractAddress,
        EvelonAbi,
        provider
      );
    }
  }

  async getAllNFTs(userAddress) {
    if (!ethers.isAddress(userAddress)) {
      throw TypeError("Invalid address");
    }
    try {
      const AllNFTs = await this.contract.getAllTokensByAddress(userAddress);
      const result = [];
      for (let i = 0; i < AllNFTs.length; i++) {
        const response = await axios.get(AllNFTs[i][3]);
        result.push({
          tokenId: AllNFTs[i][0],
          name: response.data.name,
          description: response.data.description,
          image: response.data.image,
          attributes: response.data.attributes,
        });
      }
      return result;
    } catch (err) {
      throw TypeError(err);
    }
  }

  async modifyNFT(updateData) {
    const formdata = new FormData();
    let isTokenIdPresent = false;
    let isNamePresent = false;
    let isDiscriptionPresent = false;
    let isImagePresent = false;
    let isAttributesPresent = false;
    let keysCount = 0;

    const objectsKeyArray = Object.keys(updateData);

    for (let i = 0; i < objectsKeyArray.length; i++) {
      if (objectsKeyArray[i] == "tokenId") {
        isTokenIdPresent = true;
        keysCount++;
        continue;
      }
      if (objectsKeyArray[i] == "name") {
        isNamePresent = true;
        keysCount++;
        continue;
      }
      if (objectsKeyArray[i] == "description") {
        isDiscriptionPresent = true;
        keysCount++;
        continue;
      }
      if (objectsKeyArray[i] == "image") {
        isImagePresent = true;
        keysCount++;
        continue;
      }
      if (objectsKeyArray[i] == "attributes") {
        isAttributesPresent = true;
        keysCount++;
        continue;
      }
    }

    if (!isTokenIdPresent) {
      throw Error("Please enter the tokenId");
    }

    if (objectsKeyArray.length != keysCount) {
      throw Error(
        "You have entered one or more wrong key or provided extra data"
      );
    }

    if (BigInt(updateData.tokenId) < BigInt(0)) {
      throw TypeError("TokenId should positive number");
    }

    if (isAttributesPresent) {
      if (typeof updateData.attributes != "object") {
        throw Error("atrributes should be array of Objects");
      }
    }

    if (!("name" in updateData)) {
      updateData.name = "";
    }

    if (!("description" in updateData)) {
      updateData.description = "";
    }

    if (!("image" in updateData)) {
      updateData.image = "";
    }

    if (!("attributes" in updateData)) {
      updateData.attributes = [];
    }

    updateData.attributes.map((val, index) => {
      if ("trait_type" in val && "value" in val) {
        formdata.append("attributes[][trait_type]", val.trait_type);
        formdata.append("attributes[][value]", val.value);
      } else {
        throw Error(
          "Invalid name of keys in attributes object. Make sure keys are trait_type and value"
        );
      }
    });
    const collection_id =
      updateData.tokenId.toString() +
      parseInt(this.chainId).toString() +
      this.contractAddress;
    formdata.append("collection_id", collection_id);
    formdata.append("name", updateData.name);
    formdata.append("description", updateData.description);
    formdata.append("dynamic", 0);

    if (typeof updateData.image == "object") {
      formdata.append("image", updateData.image, " ");
    } else {
      formdata.append("image", updateData.image);
    }

    try {
      const data = await axios.put(
        "https://evelon-backend.herokuapp.com/api/metadata_nfts?",
        formdata,
        {
          headers: {
            "x-api-key": this.apiKey,
          },
        }
      );
      return data;
    } catch (err) {
      throw TypeError(err.response.data.message);
    }
  }
}

module.exports = { EvelonSDK };
