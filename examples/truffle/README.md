# HRC
Harmony ERC20

## Overview
This sample project can be used to deploy an ERC20 token on Harmony's Testnet

## Pre-requisites
Please read the guideline for [Smart Contract Development using Truffle](https://docs.harmony.one/home/developers-1/which-one-are-you/h2o)

## Install

```bash
#install truffle
$npm install -g truffle@5.0.38

#clone this project
$git clone https://github.com/harmony-one/HRC.git
$cd HRC
$cp .envSample .env

#install modules
$npm install
```

## Compile smart contract
```bash
$truffle compile
```

## Deploy smart contract to Harmony's testnet 
```bash
$truffle migrate --network testnet --reset
```

## List the smart contract on testnet

```bash
$truffle networks

Network: development (id: 2)
  No contracts deployed.

Network: testnet (id: 2)
  HarmonyERC20: 0xf2c3b75dAB0e45652Bf0f9BD9e08d48b03c3926E
  Migrations: 0x7b5B72fD8A1A4B923Fb12fF1f50b5C84F920278d
```

## Get the event logs of a transaction

```bash
LOCAL=http://localhost:9500
SHARD0=https://api.s0.b.hmny.io
SHARD1=https://api.s1.b.hmny.io
SHARD2=https://api.s2.b.hmny.io
#your params
SHARD=LOCAL
#example is HRC20 mint and transfer
TXID=0x039d2f87e6bdb81220e5a7490dc783ea835443f57f4e12d16d90dd0b3aa1f5af
#curl
curl -X POST $SHARD -H 'Accept: */*'   -H 'Accept-Encoding: gzip, deflate'   -H 'Cache-Control: no-cache'   -H 'Connection: keep-alive'   -H 'Content-Length: 162'   -H 'Content-Type: application/json'   -H 'Host: api.s0.b.hmny.io'   -H 'Postman-Token: d5415117-657a-49f9-9100-a5b7ebc70daf,cc2f3cb9-2d10-408c-a003-d6e0822ec985'   -H 'User-Agent: PostmanRuntime/7.19.0'   -H 'cache-control: no-cache'   -d '{
    "jsonrpc":"2.0",
    "method":"hmy_getTransactionReceipt",
    "params":["'$TXID'"],
    "id":1
}'
```

## Interact with smart contract with a custom javascript
A custom javascript **mint_transfer.js** is used to mint and transfer token
```javascript
var HarmonyERC20 = artifacts.require("HarmonyERC20");

//mint amount address
const myAddress =   "0x3aea49553Ce2E478f1c0c5ACC304a84F5F4d1f98";

//test account address, keys under
//https://github.com/harmony-one/harmony/blob/master/.hmy/keystore/one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7.key
const testAccount = "0x7c41e0668b551f4f902cfaec05b5bdca68b124ce";

const transferAmount = 2000000;

module.exports = function() {
    async function getHarmonyERC20Information() {
        let instance = await HarmonyERC20.deployed();
        let name = await instance.name();
        let total = await instance.totalSupply();
        let decimals = await instance.decimals();
        let mybalance = await instance.balanceOf(myAddress);
        
        instance.transfer(testAccount, transferAmount);
        let testAccBalance = await instance.balanceOf(testAccount);

        console.log("HarmonyERC20 is deployed at address " + instance.address);
        console.log("Harmony ERC20 Information: Name    : " + name);
        console.log("Harmony ERC20 Information: Decimals: " + decimals);
        console.log("Harmony ERC20 Information: Total   : " + total.toString());
        console.log("my address : " + myAddress);
        console.log("test account address : " + testAccount);
        console.log("my minted    H2O balance is: " + mybalance.toString());
        console.log("test account H2O balance is: " + testAccBalance.toString());
        console.log("\ntransfered " + transferAmount.toString() + " from my address (minter) to test account");
    }
    getHarmonyERC20Information();
};
```

A custom javascript **show_balance.js** is used to show balance
```javascript
var HarmonyERC20 = artifacts.require("HarmonyERC20");

//mint amount address
const myAddress =   "0x3aea49553Ce2E478f1c0c5ACC304a84F5F4d1f98";

//test account address, keys under
//https://github.com/harmony-one/harmony/blob/master/.hmy/keystore/one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7.key
const testAccount = "0x7c41e0668b551f4f902cfaec05b5bdca68b124ce";

const transferAmount = 2000000;

module.exports = function() {
    async function getHarmonyERC20Information() {
        let instance = await HarmonyERC20.deployed();
        let name = await instance.name();
        let total = await instance.totalSupply();
        let decimals = await instance.decimals();
        let mybalance = await instance.balanceOf(myAddress);
        let testAccBalance = await instance.balanceOf(testAccount);

        console.log("HarmonyERC20 is deployed at address " + instance.address);
        console.log("Harmony ERC20 Information: Name    : " + name);
        console.log("Harmony ERC20 Information: Decimals: " + decimals);
        console.log("Harmony ERC20 Information: Total   : " + total.toString());
        console.log("my address : " + myAddress);
        console.log("test account address : " + testAccount);
        console.log("my minted    H2O balance is: " + mybalance.toString());
        console.log("test account H2O balance is: " + testAccBalance.toString());

    }
    getHarmonyERC20Information();
};
```

## Mint and send token to a test account

```bash
$ truffle exec ./mint_transfer_token.js  --network testnet
Using network 'testnet'.

HarmonyERC20 is deployed at address 0xbBE1E92631C8846ff729C09FD629F98544966c6A
Harmony ERC20 Information: Name    : HarmonyERC20
Harmony ERC20 Information: Decimals: 18
Harmony ERC20 Information: Total   : 1000000000000000000000000
my address : 0x3aea49553Ce2E478f1c0c5ACC304a84F5F4d1f98
test account address : 0x7c41e0668b551f4f902cfaec05b5bdca68b124ce
my minted    H2O balance is: 1000000000000000000000000
test account H2O balance is: 0

transfered 2000000 from my address (minter) to test account
```

type ctrl+C to exit

## Show balance of two accounts

```bash
$ truffle exec ./show_balance.js  --network testnet
Using network 'testnet'.

HarmonyERC20 is deployed at address 0xbBE1E92631C8846ff729C09FD629F98544966c6A
Harmony ERC20 Information: Name    : HarmonyERC20
Harmony ERC20 Information: Decimals: 18
Harmony ERC20 Information: Total   : 1000000000000000000000000
my address : 0x3aea49553Ce2E478f1c0c5ACC304a84F5F4d1f98
test account address : 0x7c41e0668b551f4f902cfaec05b5bdca68b124ce
my minted    H2O balance is: 999999999999999998000000
test account H2O balance is: 2000000
```

type ctrl+C to exit
