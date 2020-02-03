const { Harmony } = require("@harmony-js/core")
const { ChainType, ChainID } = require("@harmony-js/utils")
const hmy = new Harmony('http://localhost:9500/', {chainType: ChainType.Harmony, chainId: ChainID.HmyLocal})

//helper function to convert bech32 addresses to Hexadecimal
exports.toHex = (bech32Addr) => hmy.crypto.getAddress(bech32Addr).basicHex;
exports.toBech32 = (HexAddr) => hmy.crypto.getAddress(HexAddr).bech32;