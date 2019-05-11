import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import mongoose from 'mongoose'

import indexRouter from './routes/index'
import userRouter from './routes/api/userRoute'

const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, '../public')))
app.use(logger('dev'))

app.use('/', indexRouter);
app.use('/', userRouter)

const urlToMongo = '127.0.0.1:27017'
const database = 'demoJWTinNodeJS'
mongoose.connect(`mongodb://${urlToMongo}/${database}`,
    {
        useNewUrlParser: true,
        useCreateIndex: true
    })
var db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error with MongoDB'))
db.once('open', () => {
    console.log("MongoDB has been connected")
})

export default app