const mongoose = require('mongoose')

const testPaymentSchema = new mongoose.Schema({
    userID: String,
    transactionID: String,
    date : Date,
    time : Number,
    showID : String,
    seats: [Number]
})

module.exports = testPaymentSchema