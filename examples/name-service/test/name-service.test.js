var NameService = artifacts.require("NameService");

// const gasLimit = process.env.GAS_LIMIT
// const gasPrice = process.env.GAS_PRICE

contract("NameService", (accounts) => {

	// const ONE = '1000000000000000000'
	// const after = '900000000000000000'
    // let nameService
    
    const alice = accounts[0], bob = accounts[1]
    const aliceName = web3.utils.asciiToHex('Alice').padEnd(66, '0')
    console.log('aliceName', aliceName.length, aliceName)
    
	it("should be deployed", async () => {
        nameService = await NameService.deployed();
        assert.ok(nameService)
    })

    it("should allow Alice to set her name", async () => {
        await nameService.setName(aliceName, {
            from: alice
        })
        // setName should be done (next block)
        const name = await nameService.getName.call(alice)
        console.log(name)
        assert.equal(name, aliceName)
    })

    it("should allow anyone to find alice's address by name", async () => {
        const address = await nameService.getOwner.call(aliceName)
        assert.equal(address, alice)
    })
})
