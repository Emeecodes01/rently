const mongoose = require('mongoose')
const Joi = require('joi')

const customerSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    }
})

const movieSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },

})

const rentalSchema = mongoose.Schema({
    customer: {
        type: customerSchema
    },

    movie: {
        type: movieSchema
    },

    rentedOn: {
        type: Date,
        default: Date.now()
    },

    returnedOn: {
        type: Date
    }
})

const Rental = mongoose.model('Rental', rentalSchema)


function validate(rental) {
    const schema = Joi.object().keys({
        customerId: Joi.string(),
        movieId: Joi.string()
    })
    return schema.validate(rental)
}

module.exports.Rental = Rental
module.exports.validate = validate