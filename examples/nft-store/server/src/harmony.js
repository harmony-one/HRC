
const { Harmony } = require('@harmony-js/core')
// import or require settings
const { ChainType } = require('@harmony-js/utils')
// import or require simutlated keystore (optional)
const { importKey } = require('./simulated-keystore')
/********************************
Config
********************************/
const config = require('./../config')
const { net, privateKey } = config
/********************************
Harmony Setup
********************************/
const createHmy = (url) => new Harmony(url,
	{
		chainType: ChainType.Harmony,
		chainId: net,
	},
)
async function setSharding(hmy){
	const res = await hmy.blockchain.getShardingStructure();
	hmy.shardingStructures(res.result);
}
/********************************
Wallet Setup
********************************/
function setDefaultWallets(hmy){
	// add privateKey to wallet
	// localnet: one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7
	// testnet: one1w7lu05adqfhv8slx0aq8lgzglk5vrnwvf5f740
	const alice = hmy.wallet.addByPrivateKey(privateKey)
		hmy.wallet.setSigner(alice.address)
	//one1a2rhuaqjcvfu69met9sque2l3w5v9z6qcdcz65
	const bob = hmy.wallet.addByMnemonic('surge welcome lion goose gate consider taste injury health march debris kick')
	console.log('alice', alice.bech32Address)
	console.log('bob', bob.bech32Address)
}

exports.initHarmony = async (url, from) => {
    //prepare Harmony instance
    const hmy = createHmy(url)
    await setSharding(hmy)

    if (from) {
        const pkey = importKey(from)
        if(pkey) {
            hmy.wallet.addByPrivateKey(pkey)
            hmy.wallet.setSigner(hmy.crypto.getAddress(from).basicHex)
        } else {
            return {success: false, message: `account ${from} not in keystore`}
        }
    } else {
        setDefaultWallets(hmy)
    }
    return {success: true, hmy}
}