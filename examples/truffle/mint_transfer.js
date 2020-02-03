var HarmonyERC20 = artifacts.require("HarmonyERC20");
const { toHex, toBech32 } = require("./hmy-utils")

//mint amount address
const myAddress = "one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7";

//test account address, keys under
//https://github.com/harmony-one/harmony/blob/master/.hmy/keystore/one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7.key
let testAccount = "one18t4yj4fuutj83uwqckkvxp9gfa0568uc48ggj7";

const transferAmount = 20000;

module.exports = function() {
    async function getHarmonyERC20Information() {
        let instance = await HarmonyERC20.deployed();
        let name = await instance.name();
        let total = await instance.totalSupply();
        let decimals = await instance.decimals();
        
        console.log('calling transfer')
        const tx = await instance.transfer(toHex(testAccount), transferAmount);
        let testAccBalance = await instance.balanceOf(toHex(testAccount));
        let myAddrBalance = await instance.balanceOf(toHex(myAddress));

        console.log("HarmonyERC20 is deployed at address " + toBech32(instance.address));
        console.log("Harmony ERC20 Information: Name    : " + name);
        console.log("Harmony ERC20 Information: Decimals: " + decimals);
        console.log("Harmony ERC20 Information: Total   : " + total.toString());
        console.log("my address : " + myAddress);
        console.log("test account address : " + testAccount);
        console.log("my minted    H2O balance is: " + myAddrBalance.toString());
        console.log("test account H2O balance is: " + testAccBalance.toString());
        console.log("\ntransfered " + transferAmount.toString() + " from my address (minter) to test account");
    }
    getHarmonyERC20Information();
};