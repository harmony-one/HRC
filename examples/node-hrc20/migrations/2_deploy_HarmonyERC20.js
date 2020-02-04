var HarmonyERC20 = artifacts.require("HarmonyERC20");

module.exports = function(deployer, network, accounts) {

const name = "HarmonyERC20"
const symbol = "H20"
const decimals = 18
const amount = 1000000
const tokens = web3.utils.toWei(amount.toString(), 'ether')

deployer.then(function() {
  return deployer.deploy(HarmonyERC20, name, symbol, decimals, tokens).then(function() {
    });
  });
};