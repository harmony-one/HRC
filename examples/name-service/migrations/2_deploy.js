var NameService = artifacts.require("NameService");

module.exports = function (deployer, network, accounts) {
	deployer.then(function () {
		return deployer.deploy(NameService).then(function (nameService) {
			// console.log(nameService)
		});
	});
};