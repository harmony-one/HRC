const fs = require('fs')

try {
    fs.unlinkSync('./funded.json')
    fs.unlinkSync('./ips.json')
} catch (err) {
    console.error(err)
}