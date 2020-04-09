const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')

const adapter = new FileAsync('db.json')

low(adapter).then(db => {
    try {
        db.setState({
            funded: [],
            ips: []
        })
        .write()
    } catch (err) {
        console.error(err)
    }
})