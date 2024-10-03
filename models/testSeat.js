const mongoose = require('mongoose')

const testSeatSchema = new mongoose.Schema({
    seatType: String,
    seatTypeName: String,
    seats: [Boolean],
    rows: Number,
    column: Number
})

module.exports = testSeatSchema