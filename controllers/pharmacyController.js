import pharmacyModel from "../models/pharmacyModel.js";
import prescriptionModel from "../models/prescriptionModel.js";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"




//Pharmacy registration
const pharmacyRegistration = async (req,res) => {
    const {pharmacyName,password,email,pharmaNumber,address,phoneNumber,operatingHours} = req.body;
    try {

        //checking if pharmacy already exists
        const exists = await pharmacyModel.findOne({ $or:[{email}, {pharmaNumber}] });
        if (exists) {
            return res.json({success:false,message:"This pharmacy already exists please try logging in"});
        }

        //validating the pharmacies email format
        if (!validator.isEmail(email)) {
            return res.json({success:false,messsage:"Please enter a valid email"});
        }

        //validating pharmacies password length
        if (password.length<8) {
            return res.json({success:false,message:"Please enter a STRONG password. The password must be 8 characters"});
        }

        //hashing and encrypting pharmacy password
        const salt = await bcrypt.genSalt(10)
        const  hashedPassword = await bcrypt.hash(password,salt)


        //required input fields
        const newPharmacy = new pharmacyModel({
            pharmacyName:pharmacyName,
            email:email,
            password:hashedPassword,
            address:address,
            phoneNumber:phoneNumber,
            pharmaNumber:pharmaNumber,
            operatingHours:operatingHours

        })

        //saving the pharamcy in the database
        const pharmacy = newPharmacy.save();
        const token = createToken(pharmacy._id);
        res.json({success:true,token})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"An error ouccured during registration"})
    }
}

const createToken = (id) =>{
    return jwt.sign({id},process.env.JWT_SECRET)
}

//Pharmacy login
const pharmaLogin = async (req,res) =>{
    const {email,password,pharmaNumber} = req.body;
    try {
        const pharmacy = await pharmacyModel.findOne({email,pharmaNumber});

        //checking if pharmacy exists
        if (!pharmacy) {
            return res.json({success:false,message:"Pharmacy does not exist"})
        }

        //checking if pharmacies password match when logging in
        const isMatch = await bcrypt.compare(password,pharmacy.password)
        if (!isMatch) {
            return res.json({success:false,message:"Invalid password"})
        }

        //if password does match
        const token = createToken(pharmacy._id);
        res.json({success:true,token});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"error occured logging in"})
    }
}

const pharmaprescriptions = async (req,res) => {
    try {
        const pharmacyId = req.user.assignedPharmacy;
        const prescriptions = await prescriptionModel.find({ pharmacyId, status: 'Sent to pharmacy' })
          .populate('patientId', 'name')
          .populate('doctorId', 'name');
        res.json({ success: true, prescriptions });
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"error fetching prescriptions"})
    }
}




export {pharmacyRegistration,pharmaLogin,pharmaprescriptions}