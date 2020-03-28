const fs = require('fs')

try {
    fs.unlinkSync('./funded.json')
} catch (err) {
    console.error(err)
}