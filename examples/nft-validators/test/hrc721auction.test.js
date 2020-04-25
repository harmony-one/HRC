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
	const price = 	bn('100000000000000000');
	const alice = accounts[0], bob = accounts[1]
	
	it("should be deployed", async () => {
		hrc721 = await HRC721.deployed()
		auction = await HRC721Auction.deployed()
		assert.ok(hrc721 && auction)
	})

	it("should have 2 items deployed", async () => {
		const totalItems = await auction.totalItems()
		assert.equal(totalItems.toString(), '2')
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

	it("should allow the minter / owner to open the action", async () => {
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

	it("should accept a bid", async () => {
		await auction.makeBid(1, {
			from: alice,
			value: price,
			gasLimit,
			gasPrice
		})
		const totalBids = await auction.totalBids(1)
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
});