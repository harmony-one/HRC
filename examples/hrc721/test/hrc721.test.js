const HRC721 = artifacts.require("HRC721");
const HRC721Crowdsale = artifacts.require("HRC721Crowdsale");


const gasLimit = process.env.GAS_LIMIT
const gasPrice = process.env.GAS_PRICE

contract("HRC721", (accounts) => {
	let hrc721, crowdsale
	const price = '1000000000000000000';
	const alice = accounts[0], bob = accounts[1]
	it("should be deployed", async () => {
		hrc721 = await HRC721.deployed()
		crowdsale = await HRC721Crowdsale.deployed()
		assert.ok(hrc721 && crowdsale)
	})
	it("crowdsale should have 2 items deployed", async () => {
		const totalItems = await crowdsale.totalItems()
		assert.equal(totalItems.toString(), '2')
	})
	it("crowdsale should mint tokens of an item in inventory", async () => {
		for (let i = 0; i < 10; i++) {
			await crowdsale.mint(alice, 0)
		}
		const minted = await crowdsale.getMinted(0)
		assert.equal(minted.toString(), '10')
	})
	it("crowdsale should NOT mint more than the limit of item 0", async () => {
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
	it("crowdsale should mint a different item from inventory, that hasn't exceeded limit", async () => {
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
	it("should return alice's tokens", async () => {
		const tokens = (await hrc721.balanceOf(alice)).toNumber()
		for (let i = 0; i < tokens; i++) {
			const tokenId = (await hrc721.tokenOfOwnerByIndex(alice, i)).toNumber()
			const tokenData = await crowdsale.getTokenData(tokenId)
			// console.log(tokenId, tokenData)
		}
		assert.equal(tokens, 11)
	})

	/********************************
	Alice: 11
	Bob: 0
	
	********************************/
	it("should allow alice to put a token for sale", async () => {
		const tokenId = 1
		const sale = await hrc721.setSale(tokenId, price)
		// console.log(sale)
		const p = await hrc721.getSalePrice(tokenId)
		assert.equal(p, price)
	})

	it("should NOT allow bob to purchase the token at the wrong price", async () => {
		assert.equal((await hrc721.balanceOf(bob)).toNumber(), 0)
		const tokenId = 1
		try {
			await hrc721.buyTokenOnSale(tokenId, {
				from: bob,
				value: price / 2,
				gasLimit,
				gasPrice
			})
		} catch (e) {
			// console.log(e)
		}
		assert.equal((await hrc721.balanceOf(alice)).toNumber(), 11)
		assert.equal((await hrc721.balanceOf(bob)).toNumber(), 0)

	})
	it("should allow bob to purchase the token from alice", async () => {
		assert.equal((await hrc721.balanceOf(bob)).toNumber(), 0)
		const tokenId = 1
		await hrc721.buyTokenOnSale(tokenId, {
			from: bob,
			value: price,
			gasLimit,
			gasPrice
		})
		assert.equal((await hrc721.balanceOf(alice)).toNumber(), 10)
		assert.equal((await hrc721.balanceOf(bob)).toNumber(), 1)

	})
});