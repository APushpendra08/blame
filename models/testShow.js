const mongoose = require('mongoose')

const testShowSchema = new mongoose.Schema({
    theatreID: String,
    screenID: String,
    movieID : String,
    date : Date,
    time : Number,
    showID : String,
    currentStatus: String
})

module.exports = testShowSchema