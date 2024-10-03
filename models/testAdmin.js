const mongoose = require('mongoose')

const testAdminSchema = new mongoose.Schema({
    uname: String, 
    password: String,
    phoneNo: String,
    userid: String,
    adminId: String
})

module.exports = testAdminSchema