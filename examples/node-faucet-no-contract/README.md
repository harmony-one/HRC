# HRC
Harmony Faucet (No Contract)

## Overview
This is an example of a faucet used to distribute Harmony ONE tokens. If you would like to see an example of this faucet with a smart contract, please see the `node-faucet` example instead.

## Pre-requisites
NodeJS and JavaScript knowledge

## Install
```
npm i
```
## Configure
Check out the config.js file first

These are the environmental variables that need to be set to run the faucet. They can be set from the command line or in a .env file in the same directory as this README

* `ENV`: the network you're deploying to, `local`, `testnet`, or `mainnet`. This readme assumes `ENV` is set to `testnet`.
* `TESTNET_CHAIN_ID`: the chain id of the network you're connecting to (3 for OSTN, 4 for PTN) (Not applicable to `local` or `mainnet` networks).
* `TESTNET_0_URL`: the URL endpoint of the network you are connecting to. Replace `TESTNET` with `LOCAL` or `MAINNET` if you are targeting those networks.
* `TESTNET_PRIVATE_KEY`: the private key of the faucet account. This account pays for both the transactions and the funded account. Replace `TESTNET` with `LOCAL` or `MAINNET` if you are targeting those networks.
* `GAS_LIMIT`: amount of gas allotted to transactions. defaults to `2000000` gas.
* `GAS_PRICE`: amount of ONE to pay for each unit of gas. defaults to `1000000000` atto, (0.000000001 ONE).
* `TIME_LIMIT`: amount of time in ms before an address is allowed to fund again, defaults to `3600000` ms (1 hour).
* `TX_RATE`: amount in ONE to pay out from the faucet, defaults to `11000` ONE.
* `RECAPTCHA_SECRET`: the secret recaptcha key provided by google's reCAPTCHA. Defaults to a testing key.
* `RECAPTCHA_PUBLIC`: the public recaptcha key provided by google's reCAPTCHA. Defaults to a testing key.
* `PROXY`: whether the faucet is behind a reverse proxy such as nginx. Make sure to also adjust proxy settings. Default value is `false`.
* `USAGE_LIMIT`: amount of times the faucet can be used per IP. Default value is `10`

**The corresponding recaptcha public token must replace the `data-sitekey` attribute value of the recaptcha div in `/src/index.html` line 22**

## Run App
If running for the first time:
```
npm start
```
If the db needs to be cleaned, such as during a fresh deployment:
```
npm run cleanstart
```
## Endpoints
### GET
```
/balance
```
returns the balance of a ONE address
#### Parameters:
- `address`: ONE address to query balance of

```
/exposeAddress
```
returns the ONE address of the faucet
#### Parameters:
- none

### POST
```
/fund
```
Is used to fund an account, requires recaptcha token

## Examples on Local Network

### Check "Alice's" Balance 
```
localhost:3000/balance?address=one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7
```
### Check faucet's address
```
localhost:3000/exposeAddress
```