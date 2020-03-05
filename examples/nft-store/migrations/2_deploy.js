var HRC721 = artifacts.require("HRC721");
var HRC721Crowdsale = artifacts.require("HRC721Crowdsale");

module.exports = function (deployer, network, accounts) {

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
		return deployer.deploy(HRC721, name, symbol).then(function (token) {
			return deployer.deploy(HRC721Crowdsale, token.address).then(async function (sale) {
				for (let i = 0; i < 2; i++) {
					console.log(urls[i])
					await sale.addItem(10, price, urls[i])
				}
				return token.addMinter(sale.address)
			})
		});
	});
};