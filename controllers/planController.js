const Plans = require('../models/planModel')

const planController = {
    getAllPlans: async (req, res) => {
        try {
            const foundPlans = await Plans.find()
            return res.status(200).json({ sucess: true, message: "All plans", plans: foundPlans })
        } catch (error) {
            return res.status(500).json({ sucess: false })
        }
    },
    getPlan: async (req, res) => {
        try {
            const foundPlan = await Plans.findOne({ _id: req.params.id })
            return res.status(200).json({ sucess: true, plan: foundPlan, message: "The plan has been found" })
        } catch (error) {
            return res.status(500).json({ sucess: false })
        }
    },
    addPlans: async (req, res) => {
        try {
            const newPlans = await Plans.insertMany(req.body);
            return res.status(201).json({
                success: true,
                plans: newPlans,
                message: `${newPlans.length} Plan(s) have been created`
            })
        } catch (error) {
            return res.status(500).json({ sucess: false })
        }
    },
    updatePlan: async (req, res) => {
        try {
            const updatedPlan = await Plans.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
            return res.status(200).json({ sucess: true, plan: updatedPlan, message: "The plan has been updated" })
        } catch (error) {
            return res.status(500).json({ sucess: false })
        }
    },
    deletePlan: async (req, res) => {
        try {
            const deletedPlan = await Plans.findOneAndRemove({ _id: req.params.id })
            return res.status(200).json({ sucess: true, message: "The plan has been removed" })
        } catch (error) {
            return res.status(500).json({ sucess: false })
        }
    },
    getPlanByDoctorId: async (req, res) => {
        try {
            const foundDoctorPlan = await Plans.findOne({ _id: req.params.id })
            return res.status(200).json({ sucess: true, plan: foundPlan, message: "The plan has been found" })
        } catch (error) {
            return res.status(500).json({ sucess: false })
        }
    },
}

module.exports = planController