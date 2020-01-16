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
	it("crowdsale should have 10 items deployed", async () => {
		//moved to deploy
		// for (let i = 0; i < 10; i++) {
		// 	await crowdsale.addItem(10, 'https://placedog.net/' + (500 + Math.floor(Math.random()*500)))
		// }
		const totalItems = await crowdsale.totalItems()
		const limit = await crowdsale.getLimit(0)
		const minted = await crowdsale.getMinted(0)
		const url = await crowdsale.getUrl(0)
		// console.log(totalItems.toString(), limit.toString(), minted.toString(), url)
		assert.equal(totalItems.toString(), '10')
		assert.equal(limit.toString(), '10')
		assert.equal(minted.toString(), '0')
	})
	it("crowdsale should mint tokens", async () => {
		for (let i = 0; i < 10; i++) {
			await crowdsale.mint(alice, 0)
		}
		const minted = await crowdsale.getMinted(0)
		assert.equal(minted.toString(), '10')
	})
	it("crowdsale should not mint more than the limit", async () => {
		try {
			for (let i = 0; i < 10; i++) {
				await crowdsale.mint(alice, 0)
			}
		} catch (e) {
			// console.log(e)
		}
		const minted = await crowdsale.getMinted(0)
		assert.equal(minted.toString(), '10')
	})
	it("crowdsale should mint a different token that hasn't exceeded limit", async () => {
		await crowdsale.mint(alice, 1)
		const minted = await crowdsale.getMinted(1)
		assert.equal(minted.toString(), '1')
	})
	it("should return alice's tokens", async () => {
		const tokens = (await hrc721.balanceOf(alice)).toNumber()
		for (let i = 0; i < tokens; i++) {
			const tokenId = (await hrc721.tokenOfOwnerByIndex(alice, i)).toNumber()
			const tokenData = await crowdsale.getTokenData(tokenId)
			// console.log(tokenId, tokenData)
		}
		assert.equal(tokens, 11)
	})
});