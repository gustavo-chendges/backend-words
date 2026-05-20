require('dotenv').config()

const path = require('path')
const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const DBConnect = require('./config/dbConnect')
const mongoose = require('mongoose')
const httpLogger = require('./middleware/loggerMiddleware')

const PORT = process.env.PORT || 3500

DBConnect()

app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))
app.use(httpLogger)

app.use('/auth', require('./routes/authRoutes'))
app.use('/users', require('./routes/userRoutes'))
app.use('/words', require('./routes/wordsRoutes'))
app.use('/v2/words', require('./routes/v2/wordsRoutes'))

mongoose.connection.once('open', () => {
    console.log("MongoDB conectado")
    //app.listen(PORT, () => console.log(`MongoDB conectado`))
})

mongoose.connection.on('error', (err) => {
    console.log(err)
})

module.exports = app