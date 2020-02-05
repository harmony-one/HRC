var HarmonyERC20 = artifacts.require("HRC20");

const gasLimit = process.env.GAS_LIMIT
const gasPrice = process.env.GAS_PRICE

contract("HRC20", (accounts) => {
    let hrc20
	const alice = accounts[0], bob = accounts[1]
	it("should be deployed", async () => {
        hrc20 = await HarmonyERC20.deployed();
        assert.ok(hrc20)
    })

    it("should mint some tokens", async () => {
        const tx = await hrc20.mint(alice, 1000, {
            from: alice
        });
        let balance = await hrc20.balanceOf(alice);
        assert.equal(balance.toString(), '1000')
    })
    
    it("should transfer some tokens", async () => {
        const tx = await hrc20.transfer(bob, 1000, {
            from: alice
        });
        let balance = await hrc20.balanceOf(bob);
        assert.equal(balance.toString(), '1000')
    })
});