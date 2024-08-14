import mongoose from 'mongoose'


const prescriptionSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    patientChosenPharmacyId:{type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy'},
    medication: { type: String, required: true },
    request: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    status:{type:String, enum:['Sent to pharmacy', 'Ready for collection', 'Ready for delivery']},
    Note:{type:String},
    Dosage:{type:String, },
    collectionType: { type: String, enum: ['Collect', 'Delivery'], default: 'Delivery' }
  }, { timestamps: true });

  const prescriptionModel =  mongoose.models.prescription || mongoose.model("Prescription",prescriptionSchema);

export default prescriptionModel;   