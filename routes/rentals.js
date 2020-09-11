const express = require('express')
const router = express.Router()
const {Error, extractError} = require('../utils/error')
const Result = require('../utils/result')
const Status = require('../utils/statusCodes')
const {Rental, validate} = require('../models/rentals')
const {Customer} = require('../models/customers')
const mongoose = require('mongoose')
const {Movie} = require('../models/movies')
const Fawn = require('fawn')
const auth = require('../middleware/auth')

Fawn.init(mongoose)

const task = Fawn.Task();


router.post('/', auth, async (req, res) => {
    const validationResult = validate(req.body)
    if (validationResult.error) {
        res.status(Status.BadRequest)
            .send(new Error(Status.BadRequest, extractError(validationResult)))
        return
    }

    try {
        const cusId = req.body.customerId
        const customer = await Customer.findById(cusId)
        if (!customer) return res.status(Status.NotFound).send(new Error(Status.NotFound, 'Customer with this Id was not found'))


        const movieId = req.body.movieId
        const movie = await Movie.findById(movieId)
        if (!movie) return res.status(Status.NotFound).send(new Error(Status.NotFound, 'Movie with this Id was not found'))
        if (movie.numberInStock === 0) return res.status(Status.InternalServerError).send(new Error(Status.InternalServerError,
            'This movie is no more in stock'))

        const rental = new Rental({
            customer: {
                _id: customer._id,
                fullName: customer.fullName,
                phoneNumber: customer.phoneNumber
            },

            movie: {
                _id: movie._id,
                title: movie.title
            }
        })

        const moviesRented = customer.moviesRented.push({
            _id: movie._id,
            title: movie.title,
            numberInStock: movie.numberInStock,
            dailyRentalRate: movie.dailyRentalRate
        })


        task.save('rentals', rental)
            .update('movies', {_id: movie._id}, {
                $inc: {numberInStock: -1, dailyRentalRate: +1}
            })
            .update('customers', {_id: customer._id},
                {
                    moviesRented: moviesRented
                })
            .run()

        res.status(Status.OK)
            .send(new Result('Success', rental))

    }catch (e) {
        console.log(e.message)
        res.status(Status.InternalServerError).send(new Error(Status.InternalServerError, e.message))
    }

})


router.get('/', async (req, res) => {
    try {
        const rentals = await Rental.find()
        res.status(Status.OK)
            .send(new Result('Success', rentals))
    }catch (e){
        console.log(e.message)
        res.status(Status.InternalServerError).send(new Error(Status.InternalServerError, e.message))
    }
})

module.exports = router