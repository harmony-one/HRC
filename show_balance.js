var HarmonyERC20 = artifacts.require("HarmonyERC20");

//mint amount address

let myAddress =   "0x3aea49553Ce2E478f1c0c5ACC304a84F5F4d1f98";
myAddress = "0xea877e7412c313cd177959600e655f8ba8c28b40";

//test account address, keys under
//https://github.com/harmony-one/harmony/blob/master/.hmy/keystore/one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7.key
const testAccount = "0x7c41e0668b551f4f902cfaec05b5bdca68b124ce";

const transferAmount = 2000000;

module.exports = function() {
    async function getHarmonyERC20Information() {
        let instance = await HarmonyERC20.deployed();
        let name = await instance.name();
        let total = await instance.totalSupply();
        let decimals = await instance.decimals();
        let mybalance = await instance.balanceOf(myAddress);
        let testAccBalance = await instance.balanceOf(testAccount);

        console.log("HarmonyERC20 is deployed at address " + instance.address);
        console.log("Harmony ERC20 Information: Name    : " + name);
        console.log("Harmony ERC20 Information: Decimals: " + decimals);
        console.log("Harmony ERC20 Information: Total   : " + total.toString());
        console.log("my address : " + myAddress);
        console.log("test account address : " + testAccount);
        console.log("my minted    H2O balance is: " + mybalance.toString());
        console.log("test account H2O balance is: " + testAccBalance.toString());

    }
    getHarmonyERC20Information();
};