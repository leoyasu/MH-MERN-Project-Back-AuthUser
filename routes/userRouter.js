const express = require('express')
const userRouter = express.Router()
const userController = require('../controllers/usersController')
const { signUp, signIn } = userController

userRouter.route('/users/Auth/signUp').post(signUp)
userRouter.route('/users/Auth/signIn').post(signIn)

module.exports = userRouter