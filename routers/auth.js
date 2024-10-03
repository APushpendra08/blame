const express = require('express');
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()


const authRouter = express.Router();

const testUserSchema = require('../models/testUser')
const testUserModel = mongoose.model('TestUser', testUserSchema)

const testAdminSchema = require('../models/testAdmin')
const testAdminModel = mongoose.model('TestAdmin', testAdminSchema)

const jwt_secret = process.env.JWT_SECRET

authRouter.post('/signup', async (req, res, next) => {
    // extract details from the req, validate them, add the user in db, generate token, return to the frontend
    // res.send('signup endpoint')
    const uname = req.body.uname
    const plainPassword = req.body.password 
    const phoneNo = req.body.phoneNo

    const password = await bcrypt.hash(plainPassword, 10)

    const existingUser = await testUserModel.find({phoneNo})

    if(existingUser.length > 0){
        res.send({"message":"user already exists", "success": false})
    } else {
        const newUser = new testUserModel({uname, password, phoneNo})
        newUser.save()
            .then(async(newUserResp) => {

                const token = await jwt.sign({phoneNo, placekey: false}, jwt_secret)

                res.send({"message":"Sign up success", "success": true, token})
            }).catch((e) =>{
                console.log(e)
                res.send({"message":"error", "success": false})
            })
    }
})

authRouter.post('/signin', async (req, res, next) => {
    // extract details from req, validate them, check in db if users exists, generate the token and return the token
    // const uname = req.body.uname
    const plainPassword = req.body.password
    const phoneNo = req.body.phoneNo

    if(plainPassword == null || phoneNo == null)
        res.send({"message":"incorrect credentials", "success": false})

    console.log(phoneNo, plainPassword)

    const existingUser = await testUserModel.find({phoneNo})
    if(existingUser.length > 0) {
        const password = await bcrypt.hash(plainPassword, 10)
        // const registeredUser = new testUserModel({phoneNo, password})

        testUserModel.find({phoneNo, password})
            .then(async (user) => {
                const token = await jwt.sign({phoneNo, placekey: false}, jwt_secret)

                res.send({token, "message":"Sign in success", "success": true})
            })
            .catch((e) => {
                console.log(e)
                res.send({"message":"error", "success": false})
            })

    } else {
        res.status(200).send({"message":"User doesn't exist, Please sign up", "success": false})
    }
})

authRouter.post('/admin/signup', async (req, res, next) => {
    // extract details from the req, validate them, add the user in db, generate token, return to the frontend
    // res.send('signup endpoint')
    const uname = req.body.uname
    const plainPassword = req.body.password
    const phoneNo = req.body.phoneNo

    const password = await bcrypt.hash(plainPassword, 10)

    const existingUser = await testAdminModel.find({phoneNo})

    if(existingUser.length > 0){
        res.send({"message":"User already exists", "success": false})
    } else {
        const newAdmin = new testAdminModel({uname, password, phoneNo})
        newAdmin.save()
            .then(async(newUserResp) => {

                const token = await jwt.sign({id : newUserResp._id, placekey: true}, jwt_secret)

                res.send({token, "message":"Sign in success", "success": true})
            }).catch((e) =>{
                console.log(e)
                res.send({"message":"User already exists", "success": false})
            })
    }
})

authRouter.post('/admin/signin', async (req, res, next) => {
    // extract details from req, validate them, check in db if users exists, generate the token and return the token
    // const uname = req.body.uname
    const plainPassword = req.body.password
    const phoneNo = req.body.phoneNo

    const existingUser = await testAdminModel.find({phoneNo})
    if(existingUser.length > 0) {
        const password = await bcrypt.hash(plainPassword, 10)
        // const registeredUser = new testUserModel({phoneNo, password})

        testAdminModel.find({phoneNo, password})
            .then(async (user) => {
                const token = await jwt.sign({id : newUserResp._id, placekey: true}, jwt_secret)

                res.send(token)
            })
            .catch((e) => {
                console.log(e)
                res.send(e)
            })

    } else {
        res.send("user doesn't exist")
    }
})



module.exports = authRouter