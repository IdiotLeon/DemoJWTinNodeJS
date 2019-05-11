import jwt from 'jsonwebtoken'
import user from '../../model/user'

import express from 'express'
var userRouter = express.Router()

userRouter.post('/user/login',
    (req, res, next) => {
        const { body } = req
        console.log("body: " + JSON.stringify(body))
        const { username } = body
        console.log("username: " + username)
        console.log("user.username: " + user.username)
        const { password } = body
        console.log("password: " + password)
        console.log("user.password: " + user.password)

        // to check to make sure the user entered the correct username/password combo
        if (username === user.username
            && password === user.password) {
            // if user successfully log in, to generate a JWT for the user with a secret key
            jwt.sign({ user },
                'privatekey',
                { expiresIn: '1h' },
                (err, token) => {
                    if (err) { console.log(err) }
                    res.send(token)
                })
        } else {
            console.log('Error: Could not log in')
            res.sendStatus(401)
        }
    })

// to check to make sure header is not undefined: if so, to return Forbidden(403)
const checkToken = (req, res, next) => {
    const header = req.headers['authorization']

    if (typeof header !== 'undefined') {
        const bearer = header.split(' ')
        const token = bearer[1]

        req.token = token;
        next()
    } else {
        // if the header is undefined, to return Forbidden(403)
        res.sendStatus(403)
    }
}

// This is a protected route
userRouter.get('/user/data',
    checkToken,
    (req, res) => {
        // to verify the JWT gemnerated for the user
        jwt.verify(req.token,
            'privatekey',
            (err, authorizedData) => {
                if (err) {
                    console.log('Error: Could not connect to the protected route')
                    res.sendStatus(403)
                } else {
                    res.json({
                        message: 'Successfully logged in',
                        authorizedData
                    })
                    console.log('SUCCESS: Connected to protected route')
                }
            })
    })

module.exports = userRouter