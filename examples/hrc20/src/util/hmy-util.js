


export const getContractInstance = (hmy, artifact) => {
    return hmy.contracts.createContract(artifact.abi, artifact.networks[2].address)
}
export const getExtAccount = async (hmyExt) => {
    const account = await hmyExt.wallet.getAccount().catch((err) => {
        console.log(err);
    })
    account.isExt = true
    account.bech32Address = account.address
    account.address = hmyExt.crypto.getAddress(account.address).basicHex
    return account
}
export const waitForInjected = (sec) => new Promise((resolve) => {
    console.log(sec)
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