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

Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.


Migrations dry-run (simulation)
===============================
> Network name:    'testnet-fork'
> Network id:      2
> Block gas limit: 0x66916c


1_initial_migration.js
======================

   Replacing 'Migrations'
   ----------------------
   > block number:        236254
   > block timestamp:     1570227191
   > account:             0x3aea49553Ce2E478f1c0c5ACC304a84F5F4d1f98
   > balance:             923.003096645399407586
   > gas used:            246393
   > gas price:           2 gwei
   > value sent:          0 ETH
   > total cost:          0.000492786 ETH

   -------------------------------------
   > Total cost:         0.000492786 ETH


2_deploy_HarmonyERC20.js
========================

   Replacing 'HarmonyERC20'
   ------------------------
   > block number:        236256
   > block timestamp:     1570227198
   > account:             0x3aea49553Ce2E478f1c0c5ACC304a84F5F4d1f98
   > balance:             923.000266111399407586
   > gas used:            1388244
   > gas price:           2 gwei
   > value sent:          0 ETH
   > total cost:          0.002776488 ETH

   -------------------------------------
   > Total cost:         0.002776488 ETH


Summary
=======
> Total deployments:   2
> Final cost:          0.003269274 ETH





Starting migrations...
======================
> Network name:    'testnet'
> Network id:      2
> Block gas limit: 0x66916c


1_initial_migration.js
======================

   Replacing 'Migrations'
   ----------------------
   > transaction hash:    0x3be646bab73e1b6725f4e78a379db2c4227353d22732b411f43bce64312fd2ea
   > Blocks: 0            Seconds: 4
   > contract address:    0x7b5B72fD8A1A4B923Fb12fF1f50b5C84F920278d
   > block number:        236255
   > block timestamp:     1570227203
   > account:             0x3aea49553Ce2E478f1c0c5ACC304a84F5F4d1f98
   > balance:             923.003328038399407586
   > gas used:            261393
   > gas price:           1 gwei
   > value sent:          0 ETH
   > total cost:          0.000261393 ETH


   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:         0.000261393 ETH


2_deploy_HarmonyERC20.js
========================

   Replacing 'HarmonyERC20'
   ------------------------
   > transaction hash:    0xe4e7d027b24e328e5b79e3d026eb48a71c971fa112b6c74bef70e776128afa92
   > Blocks: 0            Seconds: 4
   > contract address:    0xf2c3b75dAB0e45652Bf0f9BD9e08d48b03c3926E
   > block number:        236257
   > block timestamp:     1570227219
   > account:             0x3aea49553Ce2E478f1c0c5ACC304a84F5F4d1f98
   > balance:             923.001792771399407586
   > gas used:            1493244
   > gas price:           1 gwei
   > value sent:          0 ETH
   > total cost:          0.001493244 ETH


   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:         0.001493244 ETH


Summary
=======
> Total deployments:   2
> Final cost:          0.001754637 ETH



(base) CBA-219302-MBP:H2O Xuan$ 

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

## Show blanance of two accounts

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
