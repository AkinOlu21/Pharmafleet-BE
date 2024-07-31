import mongoose from "mongoose";

const pharmacySchema = new mongoose.Schema({
    pharmacyName: {type:String, required:true},
    address:{type:String, required:true},
    phoneNumber:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    pharmaNumber:{type:String, required:true, unique:true},
    operatingHours:{ Monday:{open:String, close:String}, Tuesday:{open:String, close:String}, Wednesday:{open:String, close:String}, Thursday:{open:String, close:String},
     Friday:{open:String, close:String}, Saturday:{open:String, close:String}, Sunday:{open:String, close:String}}
}, {timestamps:true});

const pharmacyModel = mongoose.models.pharmacy || mongoose.moodel("Pharmacy",pharmacySchema);

export default pharmacyModel;