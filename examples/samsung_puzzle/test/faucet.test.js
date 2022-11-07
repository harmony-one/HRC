var Faucet = artifacts.require("Faucet");

// const gasLimit = process.env.GAS_LIMIT
// const gasPrice = process.env.GAS_PRICE

contract("Faucet", (accounts) => {

	const ONE = '1000000000000000000'
	const after = '900000000000000000'
    let faucet
	const alice = accounts[0], bob = accounts[1]
	it("should be deployed", async () => {
        faucet = await Faucet.deployed();
        assert.ok(faucet)
    })
    it("contract should be funded with one ONE", async () => {
        const balance = (await faucet.getBalance.call()).toString()
        console.log(balance)
        assert.equal(balance, ONE)
    })
    it("should allow alice to fund bob", async () => {
        const tx = await faucet.fund(bob)
        assert.ok(tx)
        const balance = (await faucet.getBalance.call()).toString()
        console.log(balance)
        assert.equal(balance, after)
    })
})