const {User, validate} = require('../models/users')
const express = require('express')
const {Error, extractError} = require('../utils/error')
const router = express.Router()
const Result = require('../utils/result')
const Status = require('../utils/statusCodes')
const _ = require('lodash')
const bcrypt= require('bcrypt')
const auth = require('../middleware/auth')


router.post('/', auth, async (req, res) => {
    const validationResult = validate(req.body)
    if (validationResult.error){
        res.status(Status.BadRequest)
            .send(new Error(Status.BadRequest, extractError(validationResult)))
        return
    }

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)

    try {
        const result = await user.save()
        res.status(Status.OK)
            .send(new Result('Success', _.pick(result, ['_id', 'name', 'email'])))

    }catch (e) {
        console.log(e.message)
        res.status(Status.InternalServerError)
            .send(new Error(Status.InternalServerError, e.message))
    }
})

module.exports = router