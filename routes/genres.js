require('express-async-errors')
const express = require('express')
const router = express.Router()
const {Genre, validate} = require('../models/genres')
const Status = require('../utils/statusCodes')
const Result = require('../utils/result')
const {Error, extractError} = require('../utils/error')
const auth = require('../middleware/auth')
const _ = require('lodash')


router.get('/', async (req, res) => {
    const genres = await Genre.find()
    res.status(Status.OK).send(new Result("Success", genres))
})



router.post('/', auth, async (req, res) => {
    const validationResult = validate(req.body)
    if (validationResult.error) {
        res.status(Status.BadRequest)
            .send(new Error(Status.BadRequest, extractError(validationResult)))
        return
    }

    let userGenre = req.body.name
    const genre = new Genre({name: userGenre})

    try {
        const result = await genre.save()
        console.log(result)

        res.status(Status.OK)
            .send(new Result("Genre saved", _.pick(result, ['_id', 'name'])))

    } catch (e) {
        res.status(Status.InternalServerError)
            .send(new Error(Status.InternalServerError,
                `Genre could not be save due to ${e.message}`))
    }

})


router.delete('/delete/:genreId', auth, async (req, res) => {
    const genreID = req.params.genreId
    try {
        const result = await Genre.deleteOne({_id: genreID})
        console.log(result)

        res.status(Status.OK)
            .send(new Result('Genre deleted', result))

    }catch (e) {
        res.status(Status.InternalServerError)
            .send(new Error(Status.InternalServerError, `Unable to delete, ${e.message}`))
    }
})


module.exports = router