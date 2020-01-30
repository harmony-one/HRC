require('dotenv').config()

export default {
    ENV: process.env.ENV,
    network: process.env.network, // 0 local, 1 testnet, 2 mainnet
    net: process.env.net, //TODO: change name
    localUrl: process.env.LOCAL_0_URL,
    testnetUrl: process.env.TESTNET_0_URL,
    mainnetUrl: process.env.MAINNET_0_URL,
}