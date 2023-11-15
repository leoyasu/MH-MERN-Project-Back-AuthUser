const express = require('express')
const userRouter = express.Router()
const userController = require('../controllers/usersController')
const {validatorSignUp , validatorSignIn} = require('../config/validator')
const { signUp, signIn ,verifyEmail} = userController

userRouter.route('/users/Auth/signUp').post(validatorSignUp,signUp)
userRouter.route('/users/Auth/signIn').post(validatorSignIn,signIn)
userRouter.route("/users/Auth/verifyEmail/:string").get(verifyEmail)
module.exports = userRouter