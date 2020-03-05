

const config = require('./../config')
const { ENV, url, net, port, privateKey, GAS_LIMIT, GAS_PRICE } = config
const gasLimit = GAS_LIMIT
const gasPrice = GAS_PRICE

// const gasLimit = '1000000'
// const gasPrice = '1000000000'

exports.oneToHexAddress = (hmy, address) => hmy.crypto.getAddress(address).basicHex
exports.hexToOneAddress = (hmy, address) => hmy.crypto.toBech32(address)
const getContractAddress = (artifact) =>
    artifact.networks[net] ? artifact.networks[net].address : config[artifact.contractName]
exports.getContractAddress = getContractAddress
exports.getContractInstance = (hmy, artifact) => {
    console.log(hmy.crypto)
    const address = getContractAddress(artifact)
    console.log('Contract Address:', address)
    const contract = hmy.contracts.createContract(artifact.abi, address)
    return contract
}
exports.callContractMethod = (contract, method, ...args) => args ?
    contract.methods[method](...args).call() :
    contract.methods[method]().call()

exports.txContractMethod = (contract, method, ...args) => new Promise((resolve, reject) => {
    let hash, receipt, error //assigned in listeners
    const done = () => resolve({
        hash, receipt, error
    })
    console.log('getContractMethod args', ...args)
    const tx = contract.methods[method](...args)
    .send({
        gasLimit,
        gasPrice
    })
    .on('transactionHash', (_hash) => {
        hash = _hash
        console.log('transactionHash', hash)
    }).on('receipt', (_receipt) => {
        receipt = _receipt
        console.log('receipt\n\n', receipt)
        console.log('\n\n')
    }).on('confirmation', (confirmationNumber, receipt) => {
        console.log('confirmed')
        done()
    }).on('error', (_error) => {
        error = _error
        console.log(error)
        done()
    })
})
