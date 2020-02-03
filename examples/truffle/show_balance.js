var HarmonyERC20 = artifacts.require("HarmonyERC20");
const { toHex, toBech32 } = require("./hmy-utils")

//mint amount address

let testAccount = "one18t4yj4fuutj83uwqckkvxp9gfa0568uc48ggj7";
// myAddress = "0xea877e7412c313cd177959600e655f8ba8c28b40";

//test account address, keys under
//https://github.com/harmony-one/harmony/blob/master/.hmy/keystore/one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7.key
const myAddress = "one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7";

const transferAmount = 2000000;

module.exports = function() {
    async function getHarmonyERC20Information() {
        let instance = await HarmonyERC20.deployed();
        let name = await instance.name();
        let total = await instance.totalSupply();
        let decimals = await instance.decimals();
        let mybalance = await instance.balanceOf(toHex(myAddress));
        let testAccBalance = await instance.balanceOf(toHex(testAccount));

        console.log("HarmonyERC20 is deployed at address " + toBech32(instance.address));
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