const Users = require('../models/userModel')

const userController = {


    singUp: async (req, res) => {
        const {fullName, email, password, from, aplication} = req.body.userData;
        try {
            const foundUsers = await Users.find()
            return res.status(200).json({ sucess: true, message: "All Users", user: foundUsers })
        } catch (error) {
            return res.status(500).json({ sucess: false })
        }
    },
    // getDoctor: async (req, res) => {
    //     try {
    //         const foundDoctor = await Doctors.findOne({ _id: req.params.id })
    //         return res.status(200).json({ sucess: true, doctor: foundDoctor, message: "The doctor has been found" })
    //     } catch (error) {
    //         return res.status(500).json({ sucess: false })
    //     }
    // },
    // addDoctors: async (req, res) => {

    //     try {
    //         const newDoctors = await Doctors.insertMany(req.body);
    //         return res.status(201).json({
    //             success: true,
    //             doctors: newDoctors,
    //             message: `${newDoctors.length} doctor(s) have been created`
    //         })
    //     } catch (error) {
    //         return res.status(500).json({ sucess: false })
    //     }
    // },
    // updateDoctor: async (req, res) => {
    //     try {
    //         const updatedDoctor = await Doctors.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
    //         return res.status(200).json({ sucess: true, doctor: updatedDoctor, message: "The doctor has been updated" })
    //     } catch (error) {
    //         return res.status(500).json({ sucess: false })
    //     }
    // },
    // deleteDoctor: async (req, res) => {
    //     try {
    //         const deletedDoctor = await Doctors.findOneAndRemove({ _id: req.params.id })
    //         return res.status(200).json({ sucess: true, message: "The doctor has been removed" })
    //     } catch (error) {
    //         return res.status(500).json({ sucess: false })
    //     }
    // }
}

module.exports = doctorController