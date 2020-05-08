const HRC721 = artifacts.require("HRC721");
const HRC721Auction = artifacts.require("HRC721Auction");

const gasLimit = process.env.GAS_LIMIT
const gasPrice = process.env.GAS_PRICE

//numbers
// https://web3js.readthedocs.io/en/v1.2.0/web3-utils.html#bn
const bn = (v) => web3.utils.toBN(v)

contract("HRC721", (accounts) => {
	let hrc721, auction
	const one = 	bn('1000000000000000000');
	const oneTenth = 	bn('100000000000000000');
	const price = 	bn('100000000000000000'); // one tenth of ONE
	const alice = accounts[0], bob = accounts[1]

	const items = 4
	
	it("should be deployed", async () => {
		hrc721 = await HRC721.deployed()
		auction = await HRC721Auction.deployed()
		assert.ok(hrc721 && auction)
	})

	it("should have 18 items deployed", async () => {
		const totalItems = await auction.totalItems()
		assert.equal(totalItems.toString(), items.toString())
	})

	/********************************
	Closed Auction
	********************************/

	it("should not accept a bid if the auction is closed", async () => {
		await auction.makeBid(1, {
			from: alice,
			value: price,
			gasLimit,
			gasPrice
		}).catch((e) => {
			// console.log(e) //capture the exception here
		})
		const totalBids = await auction.totalBids(1)
		assert.equal(totalBids.toString(), '0') //bid wasn't accepted
	})

	it("should not let bob open the auction", async () => {
		await auction.toggleIsOpen(true, {
			from: bob,
			gasLimit,
			gasPrice
		}).catch((e) => {
			// console.log(e) //capture the exception here
		})
		const isOpen = await auction.isOpen()
		assert.equal(isOpen, false)
	})

	it("should allow the minter / owner to open the auction", async () => {
		await auction.toggleIsOpen(true, {
			from: alice,
			gasLimit,
			gasPrice
		})
		const isOpen = await auction.isOpen()
		assert.equal(isOpen, true)
	})

	/********************************
	Open Auction
	********************************/

	it("should allow someone to name their address", async () => {
		await auction.setName("Alice")
		const aliceName = await auction.getName(alice)
		// const bobName = await auction.getName(bob)
		assert.equal(aliceName, 'Alice')
	})

	it("should accept a bid", async () => {
		await auction.makeBid(1, {
			from: alice,
			value: price,
			gasLimit,
			gasPrice
		})
		const totalBids = await auction.totalBids(1)
		const bidName = await auction.getBidOwnerName(1, 0)
		assert.equal(totalBids.toString(), '1')
	})

	it("should not accept a lower bid than the previous", async () => {
		await auction.makeBid(1, {
			from: alice,
			value: price.sub(oneTenth),
			gasLimit,
			gasPrice
		}).catch((e) => {
			// console.log(e) //capture the exception here
		})
		const totalBids = await auction.totalBids(1)
		assert.equal(totalBids.toString(), '1') //totalBids are still 1
	})

	it("should accept a higher bid", async () => {
		await auction.makeBid(1, {
			from: alice,
			value: price.add(oneTenth),
			gasLimit,
			gasPrice
		}).catch((e) => {
			// console.log(e) //capture the exception here
		})
		const totalBids = await auction.totalBids(1)
		assert.equal(totalBids.toString(), '2') //totalBids 2
	})

	it("should let bob out bid alice", async () => {
		const balanceBefore = bn(await web3.eth.getBalance(alice)) //use after bob out bids
		//bob makes a bid
		await auction.makeBid(1, {
			from: bob,
			value: price.add(oneTenth).add(oneTenth),
			gasLimit,
			gasPrice
		}).catch((e) => {
			// console.log(e) //capture the exception here
		})
		const totalBids = await auction.totalBids(1)
		assert.equal(totalBids.toString(), '3') //totalBids 3
		//check alice got her bid amount back
		const balanceAfter = bn(await web3.eth.getBalance(alice))
		assert.deepEqual(balanceAfter.sub(balanceBefore), price.add(oneTenth)) 
	})

	/********************************
	Close the auction and distribute NFTs
	********************************/
	

	it("should NOT allow the minter / owner to withdraw the balance BEFORE distributing NFTs", async () => {
		const balanceBefore = bn(await web3.eth.getBalance(alice))
		//distribute
		await auction.withdraw({
			from: alice,
			gasLimit,
			gasPrice
		}).catch((e) => {
			// console.log(e)
		})
		const balanceAfter = bn(await web3.eth.getBalance(alice))
		console.log(balanceBefore.toString(), balanceAfter.toString())
		// spent some gas, this isn't perfect but it checks if values are close enough
		assert.equal(balanceBefore.toString().slice(0, 5), balanceAfter.toString().slice(0, 5))
	})
	it("should allow the minter / owner to close the action and distribute NFTs", async () => {
		await auction.toggleIsOpen(false, {
			from: alice,
			gasLimit,
			gasPrice
		})
		const isOpen = await auction.isOpen()
		assert.equal(isOpen, false)
		//distribute
		await auction.distribute({
			from: alice,
			gasLimit,
			gasPrice
		})
		//check alice got her bid amount back
		const tokens = (await hrc721.balanceOf(bob)).toNumber()
		for (let i = 0; i < tokens; i++) {
			const tokenId = (await hrc721.tokenOfOwnerByIndex(bob, i)).toNumber()
			const tokenData = await auction.getTokenData(tokenId)
			console.log(tokenId, tokenData)
		}
		assert.equal(tokens, 1)
	})

	it("should allow the minter / owner to withdraw the balance", async () => {
		const balanceBefore = bn(await web3.eth.getBalance(alice))
		//distribute
		await auction.withdraw({
			from: alice,
			gasLimit,
			gasPrice
		})
		const balanceAfter = bn(await web3.eth.getBalance(alice))
		console.log(balanceBefore.toString(), balanceAfter.toString())
		assert.ok(balanceBefore.lt(balanceAfter))
	})
});