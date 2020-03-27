var HRC20 = artifacts.require("HRC20");
var HRC721 = artifacts.require("HRC721");
var HRC721Crowdsale = artifacts.require("HRC721Crowdsale");

module.exports = function (deployer, network, accounts) {

	const owner = accounts[0]

	const hrc20Name = "HarmonyHRC20"
	const hrc20Symbol = "HRC20"
	const hrc20Decimals = 18
	const hrc20MinterSupply = web3.utils.toWei('1000000', 'ether')

	const name = "HarmonyHRC721"
	const symbol = "HRC721"
	const price = '1000000000000000000';

	const urls = []
	for (let i = 0; i < 10; i++) {
		urls.push('https://placedog.net/' + (500 + 10 * i) + '/500')
	}
	urls.unshift('https://media.giphy.com/media/eYilisUwipOEM/giphy.gif')
	urls.unshift('https://media.giphy.com/media/69FmYZBku9m81vhGH3/giphy.gif')

	deployer.then(function () {
		return deployer.deploy(HRC20, hrc20Name, hrc20Symbol, hrc20Decimals, hrc20MinterSupply).then(function (hrc20) {
			return deployer.deploy(HRC721, name, symbol).then(function (hrc721) {
				return deployer.deploy(HRC721Crowdsale, owner, hrc20.address, hrc721.address).then(async function (sale) {
					// for (let i = 0; i < 2; i++) {
					// 	console.log(urls[i])
					// 	await sale.addItem(10, price, urls[i])
					// }
					return hrc721.addMinter(sale.address)
				})
			})
		})
	})
}