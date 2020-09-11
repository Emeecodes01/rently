const bcrypt = require('bcrypt')
const Joi = require('joi')
const express = require('express')
const Status = require("../utils/statusCodes");
const Result = require("../utils/result");
const { Error, extractError } = require("../utils/error");
const {User} = require('../models/users')
const router = express.Router()
const _ = require('lodash')
const jwt = require('jsonwebtoken')
const conf = require('config')



router.post('/', async (req, res) => {
    const validationResult = validate(req.body)
    if (validationResult.error) {
        res.status(Status.BadRequest)
            .send(new Error(Status.BadRequest, extractError(validationResult)))
        return
    }

    const user = await User.findOne({email: req.body.email})
    if (!user) return res.status(Status.BadRequest).send(new Error(Status.BadRequest, 'Username or password is incorrect'))

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password)
    if (!isPasswordValid) return res.status(Status.BadRequest).send(new Error(Status.BadRequest, 'Username or password is incorrect'))

    const tokenStr = await jwt.sign({_id: user._id}, conf.get('jwkPrivateKey'), {
        expiresIn: '5m'
    })

    user.token = getToken(tokenStr)

    res.status(Status.OK)
        .send(new Result('User Authenticated', _.pick(user, ['_id', 'name', 'email', 'token'])))
})



const validate = (user) => {
    const schema = Joi.object().keys({
        email: Joi.string().required().email({multiple: false}),
        password: Joi.string().required()
    })
    return schema.validate(user)
}


function getToken(tokenString) {
    const decoded = jwt.decode(tokenString)
    return {
        token: tokenString,
        iat: decoded.iat,
        exp: decoded.exp
    }
}

module.exports = router
