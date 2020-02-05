
const config = require('../config')
const { ENV, url, net, port, privateKey } = config

exports.getContractInstance = (hmy, artifact) => {
    const contract = hmy.contracts.createContract(
        artifact.abi, artifact.networks[net] ? artifact.networks[net].address : config[artifact.contractName]
    )
    return contract
}
