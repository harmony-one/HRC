const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')
const {resetDB} = require('./src/util/resetDB')

const adapter = new FileAsync('db.json')

low(adapter).then(db => {
    try {
        resetDB(db)
    } catch (err) {
        console.error(err)
    }
})