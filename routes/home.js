const express = require('express')
const Status = require('../utils/statusCodes')
const router = express.Router()


router.get('/', (req, res) => {
    res.status(Status.OK).send("Hello")
})


module.exports = router