import jwt from 'jsonwebtoken'
import user from '../../model/user'
import { generateToken, checkToken } from '../../middleware/jwt'

import express from 'express'
var userRouter = express.Router()

userRouter.post('/user/login',
    (req, res, next) => {
        const { body } = req
        const { username } = body
        const { password } = body

        // to check to make sure the user entered the correct username/password combo
        if (username === user.username
            && password === user.password) {
            // if user successfully log in, to generate a JWT for the user with a secret key
            res.json({ token: generateToken(username) })
        } else {
            console.log('Error: Could not log in')
            res.sendStatus(401)
        }
    })

// to check to make sure header is not undefined: if so, to return Forbidden(403)
// const checkToken = (req, res, next) => {
//     const header = req.headers['authorization']

//     if (typeof header !== 'undefined') {
//         const bearer = header.split(' ')
//         const token = bearer[1]

//         req.token = token;
//         next()
//     } else {
//         // if the header is undefined, to return Forbidden(403)
//         res.sendStatus(403)
//     }
// }

// This is a protected route
userRouter.get('/user/all',
    checkToken,
    (req, res) => {
        res.json({
            message: 'Successfully logged in',
            content: req.body
        })

        // to verify the JWT gemnerated for the user
        // jwt.verify(req.token,
        //     'privatekey',
        //     (err, authorizedData) => {
        //         if (err) {
        //             console.log('Error: Could not connect to the protected route')
        //             res.sendStatus(403)
        //         } else {
        //             res.json({
        //                 message: 'Successfully logged in',
        //                 authorizedData
        //             })
        //             console.log('SUCCESS: Connected to protected route')
        //         }
        //     })
    })

module.exports = userRouter