const mongoose = require('mongoose')
const Joi = require('joi')

const movieSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
    },
    dailyRentalRate: {
        type: Number,
        required: true
    }
})



const customerSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        minLength: 5
    },

    phoneNumber: {
        type: String,
        minLength: 11,
        required: true,
        unique: true
    },

    moviesRented: {
        type: [movieSchema],
        default: []
    },

    moviesReturned: {
        type: [movieSchema],
        default: []
    }
})
const Customer = mongoose.model('Customer', customerSchema)

function validate(customer) {
    const schema = Joi.object().keys({
        fullName: Joi.string(),
        phoneNumber: Joi.string()
    })
    return schema.validate(customer)
}

module.exports.Customer = Customer
module.exports.validate = validate
