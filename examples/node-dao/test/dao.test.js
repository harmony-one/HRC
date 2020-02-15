var DAO = artifacts.require("DAO");

const gasLimit = process.env.GAS_LIMIT
const gasPrice = process.env.GAS_PRICE

contract("DAO", (accounts) => {
    let dao
	const alice = accounts[0], bob = accounts[1]
	it("should be deployed", async () => {
        dao = await HarmonyDAO.deployed();
        assert.ok(dao)
    })

    it("should give right to vote ", async () => {
        const tx = await dao.giveRightToVote(alice, bob, {
            from: alice
        });
        let vote = await dao.vote(bob, 1);
    })
    
    it("should have vote", async () => {
        const tx = await dao.winningProposal({
            from: alice
        });
        let winning = await dao.winnerName();
        assert.equal(winning.toString(), 'one')
    })
});
