const express = require('express')
const Status = require('../utils/statusCodes')
const {Genre} = require('../models/genres')
const { Movie, validate } = require('../models/movies')
const {Error, extractError} = require('../utils/error')
const Result = require('../utils/result')
const auth = require('../middleware/auth')
const router = express.Router()



router.get('/', async (req, res) => {
    try {
        const movies = await Movie.find()
        res.status(Status.OK)
            .send(new Result('Success', movies))
    }catch (e) {
        console.log(e.message)
        res.status(Status.InternalServerError)
            .send(new Error(Status.InternalServerError, e.message))
    }
})


router.post('/', auth, async (req, res) => {
    const valResult = validate(req.body)
    if (valResult.error) {
        res.status(Status.BadRequest)
            .send(new Error(Status.BadRequest, extractError(valResult)))
        return
    }

    const genre = await Genre.findById(req.body.genreId)

    if (!genre) {
        console.log("Genre not found..")
        res.status(Status.BadRequest)
            .send(new Error(Status.BadRequest, 'Genre with the ID not found'))
        return
    }


    const movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    })


    try {
        const result = await movie.save()
        console.log(result)
        res.status(Status.OK)
            .send(new Result('Success', result))
    } catch (e) {
        console.log(e.message)
        res.status(Status.InternalServerError)
            .send(new Error(Status.InternalServerError, e.message))
    }

})


module.exports = router