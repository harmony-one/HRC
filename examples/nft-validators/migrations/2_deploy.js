// var HRC20 = artifacts.require("HRC20");
var HRC721 = artifacts.require("HRC721");
var HRC721Auction = artifacts.require("HRC721Auction");

module.exports = function (deployer, network, accounts) {

	const owner = accounts[0]

	// const hrc20Name = "HarmonyHRC20"
	// const hrc20Symbol = "HRC20"
	// const hrc20Decimals = 18
	// const hrc20MinterSupply = web3.utils.toWei('1000000', 'ether')

	const name = "HarmonyHRC721"
	const symbol = "HRC721"
	const price = '1000000000000000000';
	const numItemsDeployed = 6

	const urls = []
	//there are 18 validator images total
	for (let i = 1; i <= 18; i++) {
		urls.push(`https://validators-public.s3-us-west-1.amazonaws.com/${(i).toString().padStart(4, '0')}.jpg`)
	}

	deployer.then(function () {
		// return deployer.deploy(HRC20, hrc20Name, hrc20Symbol, hrc20Decimals, hrc20MinterSupply).then(function (hrc20) {
			return deployer.deploy(HRC721, name, symbol).then(function (hrc721) {
				// return deployer.deploy(HRC721Crowdsale, owner, hrc20.address, hrc721.address).then(async function (sale) {
				return deployer.deploy(HRC721Auction, owner, hrc721.address).then(async function (sale) {
					for (let i = 0; i < numItemsDeployed; i++) {
						console.log(urls[i])
						await sale.addItem(1, price, urls[i])
					}
					return hrc721.addMinter(sale.address)
				})
			})
		// })
	})
}