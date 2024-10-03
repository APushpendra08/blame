const mongoose = require('mongoose')

const testSchema = new mongoose.Schema({
    theatreID: String,
    screenCount: Number,
    name: String,
})

module.exports = testSchema