const Status = require('../utils/statusCodes')
const {Error} = require('../utils/error')
const jwt = require('jsonwebtoken')
const conf = require('config')
const {User} = require('../models/users')



module.exports = async function(req, res, next) {
    const token = req.header('x-auth-token')
    if (!token) return res.status(Status.UnAuthorized)
        .send(new Error(Status.UnAuthorized, 'You do not have authorization to perform this operation'))

    try {
        const decode = jwt.verify(token, conf.get('jwkPrivateKey'))
        req.user = await User.findById(decode._id)
        next()
    } catch (e) {
        res.status(Status.BadRequest)
            .send(new Error(Status.BadRequest, 'Incorrect token'))
    }

}