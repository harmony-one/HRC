# Harmony Protocol NFT Store Sample Dapp

This example will help you deploy an HRC-721 (ERC-721 compatible) NFT Store on the Harmony Protocol.

## Server

The dashboard, "minter" for setting the inventory and primary issuance of NFTs.

## Client

A sample Dapp where users can buy NFTs from the "minter" or "store" through a primary issuance sale.

Users can also sell items on the "market" peer to peer.

## Getting Started

1. Install packages `npm install`
2. (OPTIONAL) [Set up your harmony localnet](https://docs.harmony.one/onboarding-wiki/interns-onboarding-guide/onboarding-overview/setting-up-the-go-environment)
3. Run `npm run deploy <target_network>` to deploy the contracts, where `<target_network>` can be:
    - `local`: for a local running instance of the Harmony blockchain
    - `testnet`: for our current long running testnet (current URL: `https://api.s0.b.hmny.io/`)
    - `mainnet0`: for our Mainnet (current URL: `https://api.s0.t.hmny.io/`)
4. In the `.env` file located in the same directory as this Readme, set `ENV=<target_network>` where <target_network> is the network you deployed the smart contract to.
5. Use `npm start` to run the dapp

### Note: restarting the dapp IS necessary after re-deploying the contracts
```
npm start
```

## Making Changes

If you want to point the dapp to a contract that is already deployed on testnet or mainnet, modify the following entries in the `.env` file:
```
//HRC721 Contract Addresses
TESTNET_HRC721CROWDSALE='<testnet_HRC721Crowdsale_address>'
TESTNET_HARMONYMINTABLE='<testnet_HRC721_address>'
TESTNET_MIGRATIONS='<testnet_Migrations_address>'

//MAINNET
MAINNET_HRC721CROWDSALE='<mainnet_HRC721Crowdsale_address>'
MAINNET_HARMONYMINTABLE='<mainnet_HRC721_address>'
MAINNET_MIGRATIONS='<mainnet_Migrations_address>'
```
Replace the address fields with the hexadecimal address pointing to the contract on your network of choice.

## Other Notes
