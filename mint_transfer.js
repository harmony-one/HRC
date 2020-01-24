var HarmonyERC20 = artifacts.require("HarmonyERC20");

//test account address, keys under
//https://github.com/harmony-one/harmony/blob/master/.hmy/keystore/one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7.key
const testAccount = "0x7c41e0668b551f4f902cfaec05b5bdca68b124ce";
// the account to transfer to
// surge welcome lion goose gate consider taste injury health march debris kick
const myAddress = "0xea877e7412c313cd177959600e655f8ba8c28b40";

const transferAmount = 2000000;

module.exports = function() {
    async function getHarmonyERC20Information() {
        let instance = await HarmonyERC20.deployed();
        let name = await instance.name();
        let total = await instance.totalSupply();
        let decimals = await instance.decimals();
        let mybalance = await instance.balanceOf(myAddress);
        
        const tx = await instance.transfer(myAddress, transferAmount);
        console.log(tx)
        let testAccBalance = await instance.balanceOf(testAccount);

        console.log("HarmonyERC20 is deployed at address " + instance.address);
        console.log("Harmony ERC20 Information: Name    : " + name);
        console.log("Harmony ERC20 Information: Decimals: " + decimals);
        console.log("Harmony ERC20 Information: Total   : " + total.toString());
        console.log("my address : " + myAddress);
        console.log("test account address : " + testAccount);
        console.log("my minted    H2O balance is: " + mybalance.toString());
        console.log("test account H2O balance is: " + testAccBalance.toString());
        console.log("\ntransfered " + transferAmount.toString() + " from my address (minter) to test account");
    }
    getHarmonyERC20Information();
};