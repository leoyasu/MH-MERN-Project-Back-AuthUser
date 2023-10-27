const mongoose = require('mongoose')

const plansSchema = new mongoose.Schema({
    name : {type:String, required:true},
    specialty : {type:String, required:true},
    description : {type:String, default:"no description"},
    planCost : {type:Number, required:true},
})

const Plans = mongoose.model('plans', plansSchema)

module.exports = Plans