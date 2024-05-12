const express = require('express')
const path = require('path')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors')

const offerRoutes = require('./routes/offers')
const userRoutes = require('./routes/users')
const profilesRoutes = require('./routes/profiles')
const chatRoutes = require('./routes/chat')


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
app.use('/images/avatars', express.static(path.join('server/images/avatars')))
app.use('/images/cars', express.static(path.join('server/images/cars')))


app.use(cors());

app.use('/api/offers/', offerRoutes)
app.use('/api/users/', userRoutes)
app.use('/api/profiles/', profilesRoutes)
app.use('/api/chat/', chatRoutes)

module.exports = app;
