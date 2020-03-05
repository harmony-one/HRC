require('dotenv').config()

let network, net, url
let HRC721Crowdsale, HRC721, Migrations 

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
        HRC721Crowdsale = process.env.TESTNET_HRC721CROWDSALE
        HRC721 = process.env.TESTNET_HRC721
        Migrations = process.env.TESTNET_MIGRATIONS
        break;
    }
    case 'mainnet': {
        network = 2;
        net = 1;
        url = process.env.MAINNET_0_URL
        HRC721Crowdsale = process.env.MAINNET_HRC721CROWDSALE
        HRC721 = process.env.MAINNET_HRC721
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
    HRC721Crowdsale, HRC721, Migrations
}