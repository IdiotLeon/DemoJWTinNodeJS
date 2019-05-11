import fs from 'fs'
import path from 'path'

module.exports = {
    getJWTSecret: function () {
        var rawData = fs.readFileSync(path.join(__dirname,
            '/credentials.json'), "utf8")
        var credential = JSON.parse(rawData)
        return credential.secret
    }
}