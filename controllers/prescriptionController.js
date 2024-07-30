import prescriptionModel from "../models/prescriptionModel.js";
import userModel from "../models/userModel.js";



// API for user to create prescription
const createPrescription = async (req,res) => {

    try {
const {userId,  licenseNumber, medication, collectionType} = req.body;


         // ensuring the inputs for creating a prescription is valid
         if (!userId || !licenseNumber || !medication || !collectionType)
         {
             return res.json({success:false,message:"Please enter the required fields"});
         }
         
        // checking if doctor exists
        const doctor = await userModel.findOne({licenseNumber, role: "GP"});
        if (!doctor){
            return res.json({success:false,message:"The doctor license number is needed"});
        }

        //checking if user exists
        const user = await userModel.findById(userId);
        if (!user){
            return res.json({success:false,message:"User not found"
            })
        } 
       
 // required input fields
        const newPrescription = new prescriptionModel ({
            patientId:user._id,
            doctorId: doctor._id,
            medication:medication,
            collectionType:collectionType || 'Delivery'

        });

        // adding the prescription to the user prescription array
        const prescriptions = await newPrescription.save();
        await userModel.findByIdAndUpdate(userId,{prescriptions});
            res.json({success:true,message:"Prescription successfully created "})


   
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error creating prescription"})
    }
}


// API for accepting prescription
    const acceptPrescription = async (req,res) => {

    }

// API for rejecting prescription
    const rejectPrescription = async (req,res) => {

    }

// API for changing prescription status 
const prescriptionStatus = async (req,res) =>{

}


// API for listing prescriptions
    const prescriptionList = async (req,res) =>{
    try {
        const prescriptions = await prescriptionModel.find({});
        res.json({success:true,data:prescriptions})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Prescription list not available"})
    }
    }


//I have solved it, now i have completed the create prescription API and will wanna move onto the accept and reject prescriptions APIs

export {createPrescription,acceptPrescription,rejectPrescription,prescriptionStatus,prescriptionList}