var HarmonyERC20 = artifacts.require("HarmonyMintable");
var HRC20Crowdsale = artifacts.require("HRC20Crowdsale");

module.exports = function (deployer, network, accounts) {

	const name = "HarmonyHRC20"
	const symbol = "HRC20"
	const decimals = 18
	const amount = 1000
	const saleAmount = 1000000
	const tokens = web3.utils.toWei(amount.toString(), 'ether')
	const saleTokens = web3.utils.toWei(saleAmount.toString(), 'ether')

	deployer.then(function () {
		return deployer.deploy(HarmonyERC20, name, symbol, decimals, tokens).then(function (token) {
			return deployer.deploy(HRC20Crowdsale, 1000, accounts[0], token.address, saleTokens).then(function (sale) {
				return token.addMinter(sale.address).then((res) => {
					console.log(res.logs)
					return res
				})
			})
		});
	});
};