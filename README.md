> **Warning**
> Version 0.1.0 is under active development.

<img src="evlnlogo.png" alt="Evelon" height="40px">

[![NPM Package](https://img.shields.io/badge/npm-v0.1.0-blue)](https://www.npmjs.com/package/evelonsdk?activeTab=readme)
[![Docs](https://img.shields.io/badge/docs-%F0%9F%93%84-gold)](https://docs.evelon.app/sdk/documentation/)

**A SDK for getting and updating the NFTs created at Evelon.**

- Get all the NFTs that you created at Evelon.
- Modify any part of the NFTs like name, image, description etc.

## Overview

### Installation

#### npm

```
$ npm install evelonsdk
```

#### yarn

```
$ yarn add @evelonsdk
```

### Usage

Once installed, you can use SDK by importing it:<br>

<sub>CommonJS / NodeJs Module</sub>

```
const { EvelonSDK } = require("evelonSDK");
```

<sub>ECMAScript 6 Module</sub>

```
import EvelonSDK from "evelonSDK";
```

Once you imported the SDK you need to create an object for the SDK.

```
const config = {
    apiKey: "test_ev_cd153f49193e693ec0434dcb52a9c5a1560d7e13",
    chainId: 1287,
  };

const sdk = new EvelonSDK(config);

```

After that you can use the object according to your usses.<br>
To get all the NFTs:

```
const data = await sdk.getAllNFTs(
    "0x02F4Db4adeA0E1E84e3Ff4901c4Af3DB4Cca2f80" // Enter your address here.
  );
```

Output:

```
[
  {
    tokenId: 0n, // TokenId
    name: 'Luffy #1', // Name of NFT
    description: 'A Pirate', // Description
    image: 'https://evelon.s3.eu-central-1.amazonaws.com/22', // URL of image
    attributes: [ [Object] ] // Array of objects for the attributes
  },
  {
    tokenId: 1n, // tokenId
    name: 'Luffy #2', // Name of NFT
    description: 'A Pirate', // Description
    image: 'https://evelon.s3.eu-central-1.amazonaws.com/23', // URL of image
    attributes: [ [Object], [Object], [Object], [Object], [Object] ] // Array of objects for the attributes
  }
]
```

To update the metadata of NFTs:

```
const data =  await sdk.modifyNFT({
    tokenId: 0, // require
    name: Luffy #3, // Optional
    description: "Future pirate King" // Optional
    image: "Image URL or the path of image"  // Optional
    attributes: [{  // Optional
      trait_type1: "Power",
      value: 7000
    }],
  });
```

This will update the NFT's metadata according to data inserted.<br>
You can update the specific part of metadata, for example if you just want to update the name and description of the NFT you need to fill only those value:

```
const data =  await sdk.modifyNFT({
    tokenId: 0, // require
    name: Luffy #3,
    description: "Future pirate King"
  });
```
