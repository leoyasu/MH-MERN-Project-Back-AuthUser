const Users = require('../models/userModel')
const bcryptjs = require('bcryptjs')

const userController = {
    signUp: async (req, res) => {
        const {fullName, email, password, from, aplication} = req.body.userData;
        const hashedPassword = bcryptjs.hashSync(password,10);

        try {
            const userExist = await Users.findOne({email})

            if(userExist){
                if(userExist.from.indexOf(from) !== -1){
                    res.json({
                        sucess: false,
                        from: {from},
                        message: "El Sign Up ya fue realizado mediante "+from+", por favor realizar Sign in"
                    })
                } else {
                    userExist.from.push(from)
                    userExist.password.push(hashedPassword)
                    await userExist.save()
                    res.json({
                        sucess: true,
                        from: from,
                        message: "Se agregó "+from+" como medio a tus metodos para realizar sign in"
                    })
                }
            } else{
                const newUser = new Users({
                    fullName,
                    email,
                    password: [hashedPassword],
                    from: [from],
                    aplication
                }) 

                await newUser.save()
                res.json({
                    sucess: true,
                    from: from,
                    message: "El usuario ha sido creado y agregamos como metodo de logeo: "+from
                })
            }
        } catch (error) {
            console.log(error)
            res.json({ sucess: false, message:"Algo ha salido mal"})
        }
    },
}

module.exports = userController