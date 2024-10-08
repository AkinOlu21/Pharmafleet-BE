import orderModel from "../models/orderModel.js";
import prescriptionModel from "../models/prescriptionModel.js";
import userModel from "../models/userModel.js";



// API for user to create prescription
const createPrescription = async (req,res) => {
 const { firstName, lastName, licenseNumber, medication, collectionType, Note, address, coordinates} = req.body
    try {
        


         // ensuring the inputs for creating a prescription is valid
         if (!firstName || !lastName|| !licenseNumber || !medication || !collectionType || !address || !coordinates)
         {
             return res.json({success:false,message:"Please enter the required fields"});
         }
         
        // checking if doctor exists
        const doctor = await userModel.findOne({licenseNumber, role: "GP"});
        if (!doctor){
            return res.json({success:false,message:"The doctor license number is needed"});
        }

        //checking if user exists
        const userId = req.user.id;

        const user = await userModel.findById(userId);
        if (!user){
            return res.json({success:false,message:"User not found"
            })
        } 

        
      
 // required input fields
        const newPrescription = new prescriptionModel ({
            firstName:firstName,
            lastName:lastName,
            patientId:user._id,
            doctorId: doctor._id,
            medication:medication,
            address:address,
            coordinates:coordinates,
            Note:Note,
            collectionType:collectionType || 'Delivery'

        });

        

        const savedPrescription = await newPrescription.save();

        // Add the prescription to the doctor's prescriptions array
        await userModel.findByIdAndUpdate(doctor._id, {
          $push: { prescriptions: savedPrescription._id }
        });
    
        // Also add the prescription to the patient's prescriptions array
        await userModel.findByIdAndUpdate(user._id, {
          $push: { prescriptions: savedPrescription._id }
        });
    
        res.status(201).json({ success: true, message: 'Prescription created successfully', prescription: savedPrescription });
   
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error creating prescription"})
    }
}

 
 




 const getGPPrescriptions = async (req,res) => {
    
    try {
        const gpId = req.user._id;
    
        // Fetch the GP's document and populate the prescriptions
        const gp = await userModel.findById(gpId)
          .populate({
            path: 'prescriptions',
            populate: { path: 'patientId', select: 'name email' }
          });
    
        if (!gp || gp.role !== 'GP') {
          return res.status(403).json({ success: false, message: 'Not authorized as a GP' });
        }
    
        res.json({ success: true, data: gp.prescriptions });
      } catch (error) {
        console.error('Error fetching GP prescriptions:', error);
        res.status(500).json({ success: false, message: 'Error fetching prescriptions' });
      }
    };
 

// API for accepting prescription
    const acceptPrescription = async (req,res) => {
        try {
            const {prescriptionId} = req.params;
            const {Note, Dosage} = req.body;

            if (!Note || !Dosage){
                return res.json({success:false,message:"Please enter the required fields (Note and Dosage)"})
            }

            const acceptedPrescription = await prescriptionModel.findByIdAndUpdate(
                prescriptionId,
                {
                    request:"accepted",
                    status:"Sent to pharmacy",
                    Note,
                    Dosage
                },
                {
                    new: true,
                    runValidators: true
                }
            );

            if(!acceptedPrescription){
                return res.json({success:false,message:"Prescription not found"});
            } else{
                return res.json({success:true,message:"Prescription accepted successfully", prescription:acceptedPrescription})
            }

        } catch (error) {
            console.log(error);
            console.error("Error occured while accepting prescription")
        }
       
    };

// API for rejecting prescription
    const rejectPrescription = async (req,res) => {
        try {
            
            const {prescriptionId} = req.params;
            const {Note} = req.body;

            
            if (!Note){
                return res.json({success:false,message:"Please enter the required fields"})
            }      

            //Rejecting and Updating the status of the prescription along with a note for doctor to say why prescription was rejected
            const rejectingPrescription = await prescriptionModel.findByIdAndUpdate(
                prescriptionId,
                {
                    request:"rejected",
                    Note:Note
                },
                {
                    new: true,
                    runValidators: true
                }
            );

 
            
            if(!rejectingPrescription){
                return res.json({success:false,message:"Prescription not found"});
            } else{
                return res.json({success:true,message:"Prescription rejected successfully", prescription:rejectingPrescription})
            }
        } catch (error) {
            console.log(error);
            console.error("Error occured while rejecting prescription")
            res.json({success:false,messsage:"Error occured while rejecting prescription"})
            
        }
    }

    const deletePrescription = async (req,res) => {
        try{
            const deletePrescription = await prescriptionModel.findByIdAndDelete(req.body.id);
            res.json({success:true,message:"Prescription successfully deleted", data:deletePrescription})
        } catch (error) {
            console.log(error);
            res.json({success:false,message:"Error deleting prescription"})
        }
    }



// API for listing prescriptions
    const prescriptionList = async (req,res) =>{
    try {
        const prescriptions = await prescriptionModel.find({
            status: { $in: ['Order processing', 'Sent to pharmacy', 'Ready for collection', 'Ready for delivery', 'Out for Delivery', 'Order Collected'] }
        });
        res.json({success:true,data:prescriptions})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Prescription list not available"})
    }
    }
   


    

    //API for fetching user prescription for doctors
    const userPrescriptions = async (req,res) =>{
        try {
            // Assuming req.user contains the authenticated user's ID
            const userId = req.user.id;
    
            // Find prescriptions where the patientId matches the logged-in user's ID
            const prescriptions = await prescriptionModel.find({ patientId: userId });
    
            res.json({ success: true, data: prescriptions });
        } catch (error) {
            console.error(error);
            res.json({ success: false, message: "Error occurred", error});
        }
    }


    const updatePrescriptionOrder = async (req,res) =>{
        try{
            const {prescriptionId, status} = req.body;
            const prescription = await prescriptionModel.findByIdAndUpdate(prescriptionId,{status}, {new:true});

            if (!prescription){
                return res.json({success:false,message:"Prescription not found"});
            } 
            res.json({success:true,message:"Prescription status updated", prescription})
        } catch (error) {
            console.log(error);
            res.json({success:false,message:"Error updating prescription status"});
        }
    }


    

export {createPrescription,acceptPrescription,rejectPrescription,prescriptionList,userPrescriptions,getGPPrescriptions,deletePrescription,updatePrescriptionOrder}