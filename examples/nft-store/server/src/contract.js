

const config = require('./../config')
const { net, gasLimit, gasPrice } = config

exports.oneToHexAddress = (hmy, address) => hmy.crypto.getAddress(address).basicHex
exports.hexToOneAddress = (hmy, address) => hmy.crypto.toBech32(address)
const getContractAddress = (artifact) =>
    artifact.networks[net] ? artifact.networks[net].address : config[artifact.contractName]
exports.getContractAddress = getContractAddress
exports.getContractInstance = (hmy, artifact) => {
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
    console.log('txContractMethod args', ...args)
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
        console.log('receipt blockHash', receipt.blockHash)
    }).on('confirmation', (confirmation) => {
        console.log('\nconfirmed', confirmation, '\n')
        done()
    }).on('error', (_error) => {
        error = _error
        console.log(error)
        done()
    })
})
