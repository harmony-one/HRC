# HRC
Harmony NodeJS SDK Demo

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
## Deploy Smart Contract
```
truffle deploy --network=testnet
```
## Run App
```
npm start
```
## Endpoints
```
/giveRightToVote
```
- `voter`: ONE address to give right to vote

```
/vote
```
- `voter`: voter's address
- `proposal`: index number of the proposal
```
/winningProposal
```
```
/winnerName
```

## Examples on Local Network

### Give Alice Right to Vote
```
localhost:4000/giveRightToVote?voter=one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7
```
### Alice Vote to proposal 1
```
localhost:4000/vote?voter=one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7&proposal=1
```
### Reveal winner proposal's index
```
localhost:4000/winningProposal
```
### Reveal winner proposal's name
```
localhost:4000/winnerName
```
