const Users = require('../models/userModel')
const bcryptjs = require('bcryptjs')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const Oauth2 = google.auth.OAuth2
const jwt = require('jsonwebtoken')

const sendEmail = async (email, uniqueString) => {

    const myOauth2Client = new Oauth2(
        process.env.GOOGLE_CLIENTID,
        process.env.GOOGLE_SECRET,
        "https://developers.google.com/oauthplayground"
    )

    myOauth2Client.setCredentials({refresh_token:process.env.GOOGLE_REFRESHTOKEN});

    const accessToken = myOauth2Client.getAccessToken;

    const transporter = nodemailer.createTransport({

        service: "gmail",
        auth: {
            user: "leandrodeveloper435@gmail.com",
            type: "Oauth2",
            clientId: process.env.GOOGLE_CLIENTID,
            clientSecret: process.env.GOOGLE_SECRET,
            refreshToken: process.env.GOOGLE_REFRESHTOKEN,
            accessToken: accessToken
        },
        tls:{
            rejectUnauthorized: false
        }
    })

    const emailOptions = {
        from: "leandrodeveloper435@gmail.com",
        to: email,
        subject: "Email verification",
        html:`
            <div> 
                <h1>
                    <a href="http://localhost:3000/api/users/verifyEmail/${uniqueString}">
                        Click to verify your email
                    </a>
                </h1>
            </div>
        `
    }
    
    transporter.sendMail(emailOptions, function(error,response){
        if (error){
            console.log(error)
        } else {
            console.log("email sent")
        }
    })
}

const userController = {
    signUp: async (req, res) => {
        const { fullName, email, password, from, application } = req.body.userData;
        const hashedPassword = bcryptjs.hashSync(password, 10);
        const emailVerify = false;
        const uniqueString = crypto.randomBytes(15).toString('hex')
        try {
            const userExist = await Users.findOne({ email })

            if (userExist) {
                if (userExist.from.indexOf(from) !== -1) {
                    res.json({
                        success: false,
                        from: { from },
                        message: "The Sign Up has already been done using " + from + ", please sign in"
                    })
                } else {
                    userExist.from.push(from)
                    userExist.password.push(hashedPassword)

                    if (from !== 'sign-up-form') {
                        userExist.emailVerify = true;
                        await userExist.save()
                        res.json({
                            success: true,
                            from: from,
                            message: "Added " + from + " to your sign in methods and the email was verified"
                        })
                    } else {
                        await userExist.save()
                        res.json({
                            success: true,
                            from: from,
                            message: "Added " + from + " to your sign in methods"
                        })
                    }
                }
            } else {
                const newUser = new Users({
                    fullName,
                    email,
                    password: [hashedPassword],
                    from: [from],
                    application,
                    emailVerify,
                    uniqueString
                })
                
                if (from === 'sign-up-form') {
                    await newUser.save()

                    sendEmail(newUser.email, newUser.uniqueString)

                    res.json({
                        success: true,
                        from: from,
                        message: "Check your email to validate your account and complete the Sign Up"
                    })
                } else {
                    newUser.emailVerify = true;
                    await newUser.save()
                    res.json({
                        success: true,
                        from: from,
                        message: "The user has been created and we added it as a login method: " + from
                    })
                }
            }
        } catch (error) {
            console.log(error)
            res.json({ sucess: false, message: "Something went wrong" })
        }
    },
    signIn: async (req, res) => {
        const { email, password, from, application} = req.body.formData

        try {
            const user = await Users.findOne({ email })

            const matchPassword = user.password.filter(pass => bcryptjs.compareSync(password, pass))
            if (!user) {
                res.json({
                    success: false,
                    from: from,
                    message: "Sign In failed, You have not signed Up with this email",
                })
            } else {
                const dataUser = {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    from: user.from,
                    application: user.application
                }
                if (from !== "sign-up-form") {
                    if (matchPassword.length > 0) {

                        const token = jwt.sign({...dataUser},process.env.SECRET_TOKEN,{expiresIn:"1h"});

                        res.json({
                            success: true,
                            from: from,
                            message: "Sign In successful, welcome again: " + dataUser.fullName,
                            response: {token,dataUser}
                        })
                    } else {
                        const hashedPassword = bcryptjs.hashSync(password, 10);
                        user.from.push(from)
                        user.password.push(hashedPassword)
                        await user.save()

                        res.json({
                            success: true,
                            from: from,
                            message: "You did not have this sign in method: " + from + ". It has been added",
                            response: dataUser
                        })
                    }
                } else {
                    if (matchPassword.length > 0) {
                        const token = jwt.sign({...dataUser},process.env.SECRET_TOKEN,{expiresIn:"1h"});
                        res.json({
                            success: true,
                            from: from,
                            message: "Sign In successful, welcome again: " + dataUser.fullName,
                            response: {token, dataUser}
                        })
                    } else {
                        res.json({
                            success: false,
                            from: from,
                            message: "The username or password do not match",
                        })
                    }
                }
            }
        } catch (error) {
            console.error("Error en la función signIn:", error);
            res.json({
                success: false,
                from: from,
                message: "Sign In failed, something went wrong. Retry in a few minutes!",
                response: error
            })
        }
    }
}

module.exports = userController