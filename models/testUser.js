const mongoose = require('mongoose')

const testUserSchema = new mongoose.Schema({
    uname: String, 
    password: String,
    phoneNo: String,
    userid: String,
})

module.exports = testUserSchema