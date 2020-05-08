import config from '../../config'
const { net, url } = config


String.prototype.hexEncode = function(){
    var hex, i;

    var result = "";
    for (i=0; i<this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += ("000"+hex).slice(-4);
    }

    return result
}
String.prototype.hexDecode = function(){
    var j;
    var hexes = this.match(/.{1,4}/g) || [];
    var back = "";
    for(j = 0; j<hexes.length; j++) {
        back += String.fromCharCode(parseInt(hexes[j], 16));
    }

    return back;
}

//TODO: naming
export const getContract = (state, artifact) => {
    const { hmy, hmyExt, active } = state
    if (!hmy) {
        console.trace('call loadContracts first')
        return {}
    }
    const harmony = active && active.isExt ? hmyExt : hmy
    // console.log(harmony)
    const contract = getContractInstance(harmony, artifact)
    // console.log(contract)
    return { hmy, contract, active }
}
export const getContractInstance = (hmy, artifact) => {
    
    // console.log(hmy, artifact)

    const contract = hmy.contracts.createContract(
        artifact.abi, artifact.networks[net] ? artifact.networks[net].address : config[artifact.contractName]
    )
    return contract
}
export const oneToHexAddress = (hmy, address) => hmy.crypto.getAddress(address).basicHex

export const getExtAccount = async (hmyExt) => {
    if (!hmyExt) return {}
    console.log(url)
    hmyExt.setProvider(url)
    let account = {}
    account = await hmyExt.wallet.getAccount().catch((err) => {
        account.locked = true
        console.log(err)
    })
    if (!account || account.locked) return { locked: true }
    account.isExt = true
    account.bech32Address = account.address
    account.address = hmyExt.crypto.getAddress(account.address).basicHex
    return account
}
export const waitForInjected = (sec) => new Promise((resolve) => {
    const max = sec * 1000 / 250
    let tries = 0
    const check = () => {
        tries++
        if (tries >= max) {
            resolve(false)
            return
        }
        if (!window.harmony) setTimeout(check, 250)
        else resolve(window.harmony)
    }
    check()
})