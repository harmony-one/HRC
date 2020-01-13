# Harmony Protocol HRC-20 Token Standard

This example will help you deploy an HRC-20 (ERC-20 compatible) token on Harmony Protocol.

## Getting Started

1. Install packages `npm i`
2. [Set up your harmony localnet](https://app.gitbook.com/@harmony-one/s/onboarding-wiki/interns-onboarding-guide/onboarding-overview/setting-up-the-go-environment)
3. Run `./deploy.sh` to deploy the contracts
4. Use `npm start` to run the dapp

## Making Changes

1. After your contracts are tested and ready to deploy
2. Run `./deploy.sh` to deploy the contracts
3. Use `npm start` to run the dapp

#### Note: restarting the dapp IS necessary after re-deploying the contracts

## Other Notes

#### Contract transactions not confirming and sending error from `validators.js`

Add
```
if (!blockNumber) {
    blockNumber = '0x0'
}
```
To line 232 of your `node_modules/@harmony-js/transaction/dist/transactionBase.js`
