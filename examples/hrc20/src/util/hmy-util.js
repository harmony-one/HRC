import config from '../../config'
const { net } = config




//TODO: naming
export const getContract = (state, artifact) => {


    const { hmy, hmyExt, active } = state
    if (!hmy) {
        console.log('call loadContracts first')
        return
    }
    const harmony = active && active.isExt ? hmyExt : hmy
    const contract = getContractInstance(harmony, artifact)
    return { hmy, contract, active }
}
export const getContractInstance = (hmy, artifact) => {
    const contract = hmy.contracts.createContract(
        artifact.abi, artifact.networks[net] ? artifact.networks[net].address : config[artifact.contractName]
    )
    return contract
}
export const oneToHexAddress = (hmy, address) => hmy.crypto.getAddress(address).basicHex

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