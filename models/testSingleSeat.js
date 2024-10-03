const mongoose = require('mongoose')

const testSingleSeatSchema = new mongoose.Schema({
    seatID: String,
    showID: String,
    available: Boolean,
    inBuffer: Boolean,
    sold: Boolean,
    price: Number
})

module.exports = testSingleSeatSchema