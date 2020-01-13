var HRC721 = artifacts.require("HRC721");

module.exports = function (deployer, network, accounts) {

	const name = "HarmonyHRC721"
	const symbol = "HRC721"

	deployer.then(function () {
		return deployer.deploy(HRC721, name, symbol)
	});
};