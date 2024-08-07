import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: {type:String,required:true},
    email: {type:String,required:true,unique:true},
    password:{type:String,required:true},
    role:{type:String, enum:['Customer', 'GP', 'Driver'],default:'Customer', required:true},
    cartData:{type:Object,default:{}},
    prescriptions:[{type:mongoose.Schema.Types.ObjectId, ref: 'Prescription'}],
    assignedPharmacy:{type :mongoose.Schema.Types.ObjectId, ref: 'Pharmacy'},

    // Doctor-specific fields
    licenseNumber: { type: String, required: function() { return this.role === 'GP' } },
    patients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }]

},{minimize:false})

const userModel =  mongoose.models.user || mongoose.model("user",userSchema);

export default userModel;