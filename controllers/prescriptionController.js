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

        try {
            const {prescriptionId} = req.params;
            const {Note, Dosage} = req.body;
            
        if (!Note || !Dosage){
            return res.json({success:false,message:"Please enter the required fields"})
        }
        

        const acceptingPrescription = await prescriptionModel.findByIdAndUpdate(
            prescriptionId,
            {
                status:"accepted",
                Note:Note,
                Dosage:Dosage
            },
            {
                new: true
            }
        );

        
        if (!acceptingPrescription) {
            return res.json({success:false,message:"Prescription not found"});
        } else {
            res.json({success:true,message:"Prescription accccepted successfully"});
        }
        } catch (error) {
         console.log(error);
         res.json({sucess:false,message:"Error occured while acceptiong prescription"})   
        }
        

       
    }

// API for rejecting prescription
    const rejectPrescription = async (req,res) => {
        try {
            
            const {prescriptionId} = req.params;
            const {Note} = req.body;

            //Rejecting and Updating the status of the prescription along with a note for doctor to say why prescription was rejected
            const rejectingPrescription = await prescriptionModel.findByIdAndUpdate(
                prescriptionId,
                {
                    status:"rejected",
                    Note:Note
                },
                {
                    new: true
                }
            )


            if (!Note){
                return res.json({success:false,message:"Please enter the required fields"})
            }       
            
            if(!rejectingPrescription){
                return res.json({success:false,message:"Prescription not found"});
            } else{
                return res.json({success:true,message:"Prescription rejected successfully"})
            }
        } catch (error) {
            console.log(error);
            res.json({success:false,messsage:"Error occured while rejecting prescription"})
            
        }
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


    //API for fetching user prescription for doctors
    const userPrescriptions = async (req,res) =>{
        try {

            const userId = req.body.userId;

            const prescriptions = await prescriptionModel.find({patientId:userId});

            if (!prescriptions || prescriptions.length === 0) {
                return res.json({ success: false, message: "No prescriptions found for this user" });
            }
            res.json({success:true,data:prescriptions})
            
        } catch (error) {
            console.log(error);
            res.json({success:false,message:"Error occured"})
        }
    }


export {createPrescription,acceptPrescription,rejectPrescription,prescriptionList,userPrescriptions}