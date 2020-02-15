var HarmonyDAO = artifacts.require("DAO");

module.exports = function (deployer, network, accounts) {

	const name = "DAO"
	let args = ['one', 'two', 'three', 'four'];
	proposals = args.map((arg) => web3.utils.asciiToHex(arg))

	deployer.then(function () {
		return deployer.deploy(HarmonyDAO, proposals)
	});
};
