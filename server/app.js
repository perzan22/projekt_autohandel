const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors')

const offerRoutes = require('./routes/offers')
const userRoutes = require('./routes/users')
const profilesRoutes = require('./routes/profiles')

const app = express();

mongoose.connect('mongodb+srv://olafperzanowski:' + 'NwadPWZOOJdM4uMR' + '@cluster0.wjuhgvo.mongodb.net/autohandel-server')
.then(() => {
    console.log('Connected to MongoDB successfully')
})
.catch(() => {
    console.log('Connection to MongoDB failed')
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.use(cors());

app.use('/api/offers/', offerRoutes)
app.use('/api/users/', userRoutes)
app.use('/api/profiles/', profilesRoutes)

module.exports = app;
