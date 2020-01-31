require('dotenv').config()

let network, net, url
let HRC20Crowdsale, HarmonyMintable, Migrations 

switch(process.env.ENV){
    case 'local': {
        network = 0;
        net = 2;
        url = process.env.LOCAL_0_URL
        break;
    }
    case 'testnet': {
        network = 1;
        net = 2;
        url = process.env.TESTNET_0_URL
        HRC20Crowdsale = process.env.TESTNET_HRC20CROWDSALE
        HarmonyMintable = process.env.TESTNET_HARMONYMINTABLE
        Migrations = process.env.TESTNET_MIGRATIONS
        break;
    }
    case 'mainnet': {
        network = 2;
        net = 1;
        url = process.env.MAINNET_0_URL
        HRC20Crowdsale = process.env.MAINNET_HRC20CROWDSALE
        HarmonyMintable = process.env.MAINNET_HARMONYMINTABLE
        Migrations = process.env.MAINNET_MIGRATIONS
        break;
    }
}

export default {
    ENV: process.env.ENV,
    network: network, // 0 local, 1 testnet, 2 mainnet
    net: net, //TODO: change name
    url: url,
    filterMyAddress: true,
    //use these if not deploying contract or targeting a different deployment on (same or ) different network
    HRC20Crowdsale: HRC20Crowdsale,
    HarmonyMintable: HarmonyMintable,
    Migrations: Migrations,
}