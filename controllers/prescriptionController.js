import pharmacyModel from "../models/pharmacyModel.js";
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
        const userId = req.body.userId;

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

        // adding the prescription to the user prescription array
        const prescriptions = await newPrescription.save();
        await userModel.findByIdAndUpdate(userId,{prescriptions});
            res.json({success:true,message:"Prescription successfully created "} );
   
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error creating prescription"})
    }
}

 
 //verify prescription order
 const verifyPrescriptionOrder = async (req,res) =>{
    const {prescriptionId,success} = req.body;
    try {
        if (success=="true") {
            await prescriptionModel.findByIdAndUpdate(prescriptionId,{payment:true});
        }
    } catch (error) {
        
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
                request:"accepted",
                status:"Sent to pharmacy",
                Note:Note,
                Dosage:Dosage
            },
            {
                new: true
            }
        );
            
       const prescriptions =  await acceptingPrescription.save();
        
        if (!acceptingPrescription) {
            return res.json({success:false,message:"Prescription not found"});

            // Send prescription to the selected pharmacy
        const sendResult = await sendingPrescriptionToPharmacy(acceptingPrescription);
        
        if (sendResult.success) {
            res.json({ 
                success: true, 
                message: `Prescription accepted and sent to ${sendResult.pharmacyName} successfully` 
            });
        } else {
            res.json({ success: false, message: sendResult.message });
        }

          
        } else {
            res.json({success:true,message:"Prescription accccepted successfully"});
        }
        } catch (error) {
         console.log(error);
         res.json({sucess:false,message:"Error occured while accepting prescription"}); 
        }
        

       
    }

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
                    status:"rejected",
                    Note:Note
                },
                {
                    new: true
                }
            )

 
            
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


    const sendingPrescriptionToPharmacy = async (req,res) =>{
        try {
            // Fetch the pharmacy details from your database
            const Pharmacy = mongoose.model('Pharmacy'); // Assume you have a Pharmacy model
            const pharmacy = await Pharmacy.findById(prescription.selectedPharmacyId);
    
            if (!pharmacy) {
                throw new Error('Selected pharmacy not found in the database');
            }
    
            // Prepare the prescription data
            const prescriptionData = {
                prescriptionId: prescription._id,
                patientName: prescription.patientName,
                patientId: prescription.patientId,
                medicationName: prescription.medicationName,
                dosage: prescription.Dosage,
                frequency: prescription.frequency,
                duration: prescription.duration,
                doctorName: prescription.doctorName,
                doctorId: prescription.doctorId,
                notes: prescription.Note,
                dateIssued: new Date().toISOString()
            };
    
            // Update the pharmacy's pending prescriptions
            pharmacy.pendingPrescriptions.push(prescriptionData);
            await pharmacy.save();
    
            // Update the prescription status in your database
            await prescriptionModel.findByIdAndUpdate(prescription._id, {
                status: "Sent to pharmacy",
                pharmacyName: pharmacy.name,
                pharmacyAddress: pharmacy.address
            });
    
            console.log(`Prescription ${prescription._id} successfully sent to pharmacy ${pharmacy.name}`);
    
            // Simulate sending a notification to the pharmacy
            await sendNotificationToPharmacy(pharmacy, prescriptionData);
    
            return { 
                success: true, 
                message: "Prescription sent to pharmacy successfully", 
                pharmacyName: pharmacy.name 
            };
        } catch (error) {
            console.error("Error sending prescription to pharmacy:", error);
            return { 
                success: false, 
                message: `Error occurred while sending prescription to pharmacy: ${error.message}` 
            };
        }
    }

export {createPrescription,acceptPrescription,rejectPrescription,prescriptionList,userPrescriptions}