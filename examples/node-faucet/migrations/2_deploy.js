var Faucet = artifacts.require("Faucet");

module.exports = function (deployer, network, accounts) {

	const ONE = 10000000000000000 //Deploy with a balance of 0.01 ONE

	deployer.then(function () {
		return deployer.deploy(Faucet, {
			value: ONE,
		}).then(function (faucet) {
			// console.log(faucet)
		});
	});
};