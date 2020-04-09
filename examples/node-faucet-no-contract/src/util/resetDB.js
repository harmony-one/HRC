const distribution = require('../../distribution.json')

exports.resetDB = (db) => {
    if(db){
        console.log('Resetting DB')
        db.setState(baseDB).write()
    }
}

const baseDB = {
    funded: [],
    distribution: distribution,
    ips: []
}

exports.baseDB = baseDB