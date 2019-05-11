import jwt from 'jsonwebtoken'
import { getJWTSecret } from '../credentials/credentials'

let generateToken = (username, expiresIn = '1h') => {
    return jwt.sign({ username: username },
        getJWTSecret(),
        { expiresIn: expiresIn })
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * 
 * an example of decoded:
 * {
    "message": "Successfully logged in",
    "authorizedData": {
        "user": {
            "username": "user123",
            "password": "1234",
            "firstName": "Jon",
            "lastName": "Doe",
            "dob": "12/11/1991",
            "email": "user@gmail.com",
            "address": {
                "street": "555 Bayshore Blvd",
                "city": "Tampa",
                "state": "Florida",
                "zip": "33813"
            }
        },
        "iat": 1557548475,
        "exp": 1557552075
    }
}
 */
let checkToken = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization']
    if (token.startsWith('Bearer ')) {
        token = token.split(' ')[1]
    }

    if (token) {
        jwt.verify(token,
            getJWTSecret(),
            (err, decoded) => {
                if (err) {
                    return res.json({
                        success: false,
                        message: 'Token is not valid'
                    })
                } else {
                    req.token = decoded
                    next()
                }
            })
    } else {
        return res.json({
            success: false,
            message: 'Auth token has not been provided'
        })
    }
}

module.exports = {
    generateToken: generateToken,
    checkToken: checkToken
}