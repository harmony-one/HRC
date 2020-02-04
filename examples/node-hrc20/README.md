# HRC
Harmony NodeJS SDK Demo

For now this is a copy of `/examples/node-sdk`

# TODO
* HRC20 Contracts Integration

## Overview
This sample project can be cloned to interact with the Harmony Blockchain on Local, Test and Main networks

## Pre-requisites
NodeJS and JavaScript knowledge
Check out the .env and config.js files first

## Install
```
npm i
```
## Configure
```
In `.env` set `ENV=[local|testnet|mainnet]`
```
## Run App
```
npm start
```
## Test "Alice's" Balance 
```
localhost:3000/balance?address=one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7
```
## Send "Bob" ONE tokens
```
localhost:3000/transfer?to=one1a2rhuaqjcvfu69met9sque2l3w5v9z6qcdcz65&value=1
```
## Check "Bob's" Balance
```
localhost:3000/balance?address=one1a2rhuaqjcvfu69met9sque2l3w5v9z6qcdcz65
```