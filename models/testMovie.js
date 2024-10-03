const mongoose = require('mongoose')

const testMovieSchema = new mongoose.Schema({
    movieID: String,
    name:String,
    description: String,
    screenTime: Number
})

module.exports = testMovieSchema