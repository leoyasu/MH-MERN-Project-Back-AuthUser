const passport = require("passport")
const jwtStrategy = require("passport-jwt").Strategy
const extractJWT = require("passport-jwt").ExtractJwt
const UserModel = require("../models/userModel")
module.exports = passport.use(new jwtStrategy({
    //arg1 de strategia
    jwtFromRequest: extractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_TOKEN
},
    //arg2 DE estrategia
    (jwt_payload, done) => {
        console.log("passport", jwt_payload)
        UserModel.finOne({ _id: jwt_payload.id })
            .the(user => {//se encuentra el usuario
                if (user) {
                    console.log("usuario", user)
                    return done(null, user)
                }
                if (error) {
                    console.log("error al leer usuario de BD en passport.js", err)

                    return (error, false)
                } else {
                    return done(null, false)

                }
            }).catch(er=>{
                console.log("catcheo de error en passoport.js: ",err)
                return done(er,false)
            })
    }
))