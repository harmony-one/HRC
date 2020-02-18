var Faucet = artifacts.require("Faucet");

module.exports = function (deployer, network, accounts) {

	const ONE = 1000000000000000000

	deployer.then(function () {
		return deployer.deploy(Faucet, {
			value: ONE
		}).then(function (faucet) {
			// console.log(faucet)
		});
	});
};