const express = require('express');

const authRouter = express.Router();

authRouter.get('/signup', (req, res, next) => {
    // extract details from the req, validate them, add the user in db, generate token, return to the frontend
    res.send('signup endpoint')
})

authRouter.post('/signin', (req, res, next) => {
    // extract details from req, validate them, check in db if users exists, generate the token and return the token
})

module.exports = authRouter