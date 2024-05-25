const Car = require('../models/car')

exports.getCars = (req, res, next) => {
    Car.find().then(documents => {
        res.status(201).json({
            message: 'Cars fetched succesfully!',
            cars: documents
        })
    })
}