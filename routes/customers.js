const {Customer, validate} = require('../models/customers')
const express = require('express')
const router = express.Router()
const {Error, extractError} = require('../utils/error')
const Result = require('../utils/result')
const Status = require('../utils/statusCodes')
const auth = require('../middleware/auth')

router.get('/:customerId',async (req, res) =>  {
    try {
        const customer = await Customer.findById(req.params.customerId)
        res.status(Status.OK)
            .send(new Result('Success', customer))
    }catch (e) {
        console.log(e)
        res.status(Status.InternalServerError)
            .send(new Error(Status.InternalServerError, e.message))
    }
})


router.get('/',async (req, res) =>  {
    try {
        const customers = await Customer.find()
        res.status(Status.OK)
            .send(new Result('Success', customers))
    }catch (e) {
        console.log(e)
        res.status(Status.InternalServerError)
            .send(new Error(Status.InternalServerError, e.message))
    }
})



router.post('/', auth, async (req, res) => {
    const validationResult = validate(req.body)
    if (validationResult.error){
        res.status(Status.BadRequest)
            .send(new Error(Status.BadRequest, extractError(validationResult)))
        return
    }

    const customer = new Customer({
        fullName: req.body.fullName,
        phoneNumber: req.body.phoneNumber
    })

    const result = await customer.save()
    res.status(Status.OK)
        .send(new Result('Success', result))
})

module.exports = router