const mongoose = require('mongoose')

const testScreenSchema = new mongoose.Schema({
    theatreID: String,
    screenID: String,
    seats: Number,
})

module.exports = testScreenSchema