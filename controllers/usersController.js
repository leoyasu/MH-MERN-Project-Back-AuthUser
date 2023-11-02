const Users = require('../models/userModel')
const bcryptjs = require('bcryptjs')

const userController = {
    signUp: async (req, res) => {
        const { fullName, email, password, from, aplication } = req.body.userData;
        const hashedPassword = bcryptjs.hashSync(password, 10);

        try {
            const userExist = await Users.findOne({ email })

            if (userExist) {
                if (userExist.from.indexOf(from) !== -1) {
                    res.json({
                        success: false,
                        from: { from },
                        message: "El Sign Up ya fue realizado mediante " + from + ", por favor realizar Sign in"
                    })
                } else {
                    userExist.from.push(from)
                    userExist.password.push(hashedPassword)
                    await userExist.save()
                    res.json({
                        success: true,
                        from: from,
                        message: "Se agregó " + from + " como medio a tus metodos para realizar sign in"
                    })
                }
            } else {
                const newUser = new Users({
                    fullName,
                    email,
                    password: [hashedPassword],
                    from: [from],
                    aplication
                })

                await newUser.save()
                res.json({
                    success: true,
                    from: from,
                    message: "El usuario ha sido creado y agregamos como metodo de logeo: " + from
                })
            }
        } catch (error) {
            console.log(error)
            res.json({ sucess: false, message: "Algo ha salido mal" })
        }
    },
    signIn: async (req, res) => {
        const { email, password, from } = req.body.formData

        try {
            const user = await Users.findOne({email})
            const matchPassword = user.password.filter(pass => bcryptjs.compareSync(password, pass))
            if (!user) {
                res.json({
                    success: false,
                    from: from,
                    message: "Sign In fallido, No has realizado Sign Up con este email",
                })
            } else {
                const dataUser = {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    from: user.from,
                }
                if (from !== "sign-up-form") {
                    if (matchPassword.length > 0) {
                        res.json({
                            success: true,
                            from: from,
                            message: "Sign In realizado",
                            response: dataUser
                        })
                    } else {
                        const hashedPassword = bcryptjs.hashSync(password, 10);
                        user.from.push(from)
                        user.password.push(hashedPassword)
                        await user.save()

                        res.json({
                            success: true,
                            from: from,
                            message: "No contabas con este ingreso: " + from + ". Se ha agregado",
                            response: dataUser
                        })
                    }
                } else {
                    if (matchPassword.length > 0) {
                        res.json({
                            success: true,
                            from: from,
                            message: "Sign In realizado",
                            response: dataUser
                        })
                    } else {
                        res.json({
                            success: false,
                            from: from,
                            message: "El user o password no coinciden",
                        })
                    }
                }
            }
        } catch (error) {
            console.error("Error en la función signIn:", error);
            res.json({
                success: false,
                from: from,
                message: "Sign In fallido, algo salió mal. Reintentar en unos minutos!  " + from,
                response: error
            })
        }
    }
}

module.exports = userController