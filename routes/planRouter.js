const express = require('express')
const planRouter = express.Router()
const planController = require('../controllers/planController')


planRouter.get('/plans',planController.getAllPlans)
planRouter.post('/plans',planController.addPlans)

planRouter.get('/plans/:id',planController.getPlan)
planRouter.put('/plans/:id',planController.updatePlan)
planRouter.delete('/plans/:id',planController.deletePlan)

planRouter.get('/plans/:doctorId',planController.getPlanByDoctorId)

module.exports = planRouter