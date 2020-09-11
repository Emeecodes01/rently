const rentlyApp = require('./app')
const express = require('express')
const app = express()
const helmet = require('helmet')
const morgan = require('morgan')
const genreRouter = require('./routes/genres')
const homeRoute = require('./routes/home')
const moviesRouter = require('./routes/movies')
const customersRouter = require('./routes/customers')
const rentalRouter = require('./routes/rentals')
const userRouter = require('./routes/users')
const authRouter = require('./routes/auth')
const error = require('./middleware/error')
const conf = require('config')


//middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(helmet())
app.use(morgan('tiny'))


//api routers
app.use('/', homeRoute)
app.use('/api/v1/genres', genreRouter)
app.use('/api/v1/movies', moviesRouter)
app.use('/api/v1/customers', customersRouter)
app.use('/api/v1/rentals', rentalRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/login', authRouter)
app.use(error)


if (!conf.get('jwkPrivateKey')){
    console.error('JWT Private key not found')
    process.exit(1)
}


rentlyApp.start()


const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})