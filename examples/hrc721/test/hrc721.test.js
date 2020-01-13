const HRC721 = artifacts.require("HRC721");

contract("HRC721", (accounts) => {
  it("should be deployed", async () => {
    const hrc721 = await HRC721.deployed()
    assert.ok(hrc721)
  })
});