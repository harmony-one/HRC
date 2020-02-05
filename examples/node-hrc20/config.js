require('dotenv').config()

let network, net, url, privateKey
let HRC20Crowdsale, HarmonyMintable, Migrations 

switch(process.env.ENV){
    case 'local': {
        network = 0;
        net = 2;
        url = process.env.LOCAL_0_URL
        privateKey = process.env.LOCAL_PRIVATE_KEY
        break;
    }
    case 'testnet': {
        network = 1;
        net = 2;
        url = process.env.TESTNET_0_URL
        privateKey = process.env.TESTNET_PRIVATE_KEY
        HRC20Crowdsale = process.env.TESTNET_HRC20CROWDSALE
        HarmonyMintable = process.env.TESTNET_HARMONYMINTABLE
        Migrations = process.env.TESTNET_MIGRATIONS
        break;
    }
    case 'mainnet': {
        network = 2;
        net = 1;
        url = process.env.MAINNET_0_URL
        privateKey = process.env.MAINNET_PRIVATE_KEY
        HRC20Crowdsale = process.env.MAINNET_HRC20CROWDSALE
        HarmonyMintable = process.env.MAINNET_HARMONYMINTABLE
        Migrations = process.env.MAINNET_MIGRATIONS
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
    //use these if not deploying contract or targeting a different deployment on (same or ) different network
    HRC20Crowdsale: HRC20Crowdsale,
    HarmonyMintable: HarmonyMintable,
    Migrations: Migrations,
}