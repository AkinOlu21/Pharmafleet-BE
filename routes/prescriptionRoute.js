import express from "express"
import {acceptPrescription, createPrescription, prescriptionList,rejectPrescription, userPrescriptions, deletePrescription, getGPPrescriptions} from "../controllers/prescriptionController.js"
import authMiddleware from "../middleware/auth.js"
import authorizeDoctorMiddleware from "../middleware/authDoctor.js";


const prescriptionRouter = express.Router();

prescriptionRouter.get('/prescriptionlist',prescriptionList);
prescriptionRouter.post('/create',authMiddleware,createPrescription)
prescriptionRouter.get('/userprescriptions',authMiddleware,userPrescriptions)
prescriptionRouter.post('delete',deletePrescription)
prescriptionRouter.get('/GPprescriptions',authorizeDoctorMiddleware,getGPPrescriptions);
prescriptionRouter.patch('/:prescriptionId/accept',acceptPrescription);
prescriptionRouter.patch('/:prescriptionId/reject',rejectPrescription);


export default prescriptionRouter;