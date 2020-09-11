const mongoose = require('mongoose')
const Joi = require('joi')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        unique: true,
        required: true
    },

    password: {
        type: String,
        unique: true,
        required: true
    }
})

const User = mongoose.model('Users', userSchema)

const validate = (user) => {
    const schema = Joi.object().keys({
        name: Joi.string().required().min(5),
        email: Joi.string().required().email({multiple: false}),
        password: Joi.string().required()
    })
    return schema.validate(user)
}


module.exports.User = User
module.exports.validate = validate