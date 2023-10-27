const express = require('express')
const userRouter = express.Router()
const userController = require('../controllers/usersController')
const { signUp } = userController

userRouter.route('/users/Auth/signUp').post(signUp)

module.exports = userRouter