const mongoose = require('mongoose')
const { GenreSchema } = require('../models/genres')
const Joi = require('joi')

const movieSchema = mongoose.Schema({
    title: String,
    genre: GenreSchema,
    numberInStock: {type: Number, default: 0},
    dailyRentalRate: {type: Number, default: 0}
})

const Movie = mongoose.model('Movie', movieSchema)

function validate(movie) {
    const schema = Joi.object().keys({
        title: Joi.string().min(3).max(255),
        genreId: Joi.string().min(5),
        numberInStock: Joi.number().positive(),
        dailyRentalRate: Joi.number().positive()
    })
    return schema.validate(movie)
}

module.exports.Movie = Movie
module.exports.validate = validate

