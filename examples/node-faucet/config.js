require('dotenv').config()

let network, net, url, privateKey, Faucet
const ONE = 1000000000000000000 // 1 ONE in atto

switch(process.env.ENV){
    case 'local': {
        network = 0
        net = 2
        url = process.env.LOCAL_0_URL
        privateKey = process.env.LOCAL_PRIVATE_KEY
        break;
    }
    case 'testnet': {
        network = 1;
        net = parseInt(process.env.TESTNET_CHAIN_ID, 10)
        url = process.env.TESTNET_0_URL
        Faucet = process.env.TESTNET_FAUCET
        privateKey = process.env.TESTNET_PRIVATE_KEY
        break;
    }
    case 'mainnet': {
        network = 2
        net = 1
        url = process.env.MAINNET_0_URL
        Faucet = process.env.MAINNET_FAUCET
        privateKey = process.env.MAINNET_PRIVATE_KEY
        break;
    }
}


module.exports = {
    port: 3000,
    privateKey,
    ENV: process.env.ENV,
    network, // 0 local, 1 testnet, 2 mainnet
    net, //TODO: change name
    url,
    GAS_LIMIT: process.env.GAS_LIMIT,
    GAS_PRICE: process.env.GAS_PRICE,
    timeLimit: process.env.TIME_LIMIT ? parseInt(process.env.TIME_LIMIT) : 3600000, // 1 Hour
    txRate: process.env.TX_RATE ? parseInt(process.env.TX_RATE) : 11000 * ONE, //11000 ONE
    Faucet
}