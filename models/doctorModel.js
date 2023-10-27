const mongoose = require('mongoose')

const doctorsSchema = new mongoose.Schema({
    name : {type:String, required:true},
    lastName : {type:String, required:true},
    specialty : {type:String, required:true},
    description : {type:String, default:"no description"},
    image : {type:String, default:"no image"},
    dni : {type:Number, required:true},
    license : {type:Number, required:true},
    meetCost : {type:Number, required:true},
    plans: [{ type: mongoose.Types.ObjectId, ref: 'plans' }]
})

const Doctors = mongoose.model('doctors', doctorsSchema)

module.exports = Doctors