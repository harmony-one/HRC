const HRC721 = artifacts.require("HRC721");
const HRC721Crowdsale = artifacts.require("HRC721Crowdsale");

contract("HRC721", (accounts) => {
	let hrc721, crowdsale
	const alice = accounts[0], bob = accounts[1]
	it("should be deployed", async () => {
		hrc721 = await HRC721.deployed()
		crowdsale = await HRC721Crowdsale.deployed()
		assert.ok(hrc721 && crowdsale)
	})
	it("crowdsale should mint tokens", async () => {
		for (let i = 0; i < 10; i++) {
			await crowdsale.mintWithData(alice, 'https://example.com')
		}
		const supply = await hrc721.totalSupply()
		assert.equal(supply.toString(), '10')
	})
});