require('dotenv').config()
const { TruffleProvider } = require('@harmony-js/core')
//Local
const local_mnemonic = process.env.LOCAL_MNEMONIC
const local_private_key = process.env.LOCAL_PRIVATE_KEY
const local_url = process.env.LOCAL_0_URL;
//Testnet
const testnet_mnemonic = process.env.TESTNET_MNEMONIC
const testnet_private_key = process.env.TESTNET_PRIVATE_KEY
const testnet_url = process.env.TESTNET_0_URL
const testnet_chain_id = process.env.TESTNET_CHAIN_ID
//const testnet_0_url = process.env.TESTNET_0_URL
//const testnet_1_url = process.env.TESTNET_1_URL
//Mainnet
const mainnet_mnemonic = process.env.MAINNET_MNEMONIC
const mainnet_private_key = process.env.MAINNET_PRIVATE_KEY
const mainnet_url = process.env.MAINNET_0_URL;

//GAS - Currently using same GAS accross all environments
gasLimit = process.env.GAS_LIMIT
gasPrice = process.env.GAS_PRICE

module.exports = {

  networks: {
    local: {
      network_id: '2', 
      provider: () => {
        const truffleProvider = new TruffleProvider(
          local_url,
          { memonic: local_mnemonic },
          { shardID: 0, chainId: 2 },
          { gasLimit: gasLimit, gasPrice: gasPrice},
        );
        const newAcc = truffleProvider.addByPrivateKey(local_private_key);
        truffleProvider.setSigner(newAcc);
        return truffleProvider;
      },
    },
    testnet: {
      network_id: '*', 
      provider: () => {
        const truffleProvider = new TruffleProvider(
          testnet_url,
          { memonic: testnet_mnemonic },
          { shardID: 0, chainId: parseInt(testnet_chain_id, 10)},
          { gasLimit: gasLimit, gasPrice: gasPrice},
        );
        const newAcc = truffleProvider.addByPrivateKey(testnet_private_key);
        truffleProvider.setSigner(newAcc);
        return truffleProvider;
      },
      skipDryRun: true,
    },
    mainnet0: {
      network_id: '1', 
      provider: () => {
        const truffleProvider = new TruffleProvider(
          mainnet_url,
          { memonic: mainnet_mnemonic },
          { shardID: 0, chainId: 1 },
          { gasLimit: gasLimit, gasPrice: gasPrice },
        );
        const newAcc = truffleProvider.addByPrivateKey(mainnet_private_key);
        truffleProvider.setSigner(newAcc);
        return truffleProvider;
      },
    },
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.5.8",
    }
  }
}
