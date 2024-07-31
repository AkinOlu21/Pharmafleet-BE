import mongoose from 'mongoose'


const prescriptionSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    medication: { type: String, required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    Note:{type:String},
    Dosage:{type:String, required: true},
    collectionType: { type: String, enum: ['Collect', 'Delivery'], default: 'Delivery' }
  }, { timestamps: true });

  const prescriptionModel =  mongoose.models.prescription || mongoose.model("Prescription",prescriptionSchema);

export default prescriptionModel;   