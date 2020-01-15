var HRC721 = artifacts.require("HRC721");
var HRC721Crowdsale = artifacts.require("HRC721Crowdsale");

module.exports = function (deployer, network, accounts) {

	const name = "HarmonyHRC721"
	const symbol = "HRC721"

	deployer.then(function () {
		return deployer.deploy(HRC721, name, symbol).then(function (token) {
			return deployer.deploy(HRC721Crowdsale, token.address).then(async function (sale) {
				for (let i = 0; i < 10; i++) {
					await sale.addItem(10, 'https://placedog.net/' + (500 + Math.floor(Math.random()*500)))
				}
				return token.addMinter(sale.address)
			})
		});
	});
};