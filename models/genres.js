const mongoose = require('mongoose')
const Joi = require('joi')

const GenreSchema = mongoose.Schema({
    name: {type: String, minLength: 5, maxLength: 100, unique: true}
})

const Genre = mongoose.model('Genre', GenreSchema)


function validate(body) {
    const schema = Joi.object().keys({
        name: Joi.string().min(3).max(15)
    })
    return schema.validate(body)
}

module.exports.Genre = Genre
module.exports.validate = validate
module.exports.GenreSchema = GenreSchema