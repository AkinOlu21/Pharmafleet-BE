import express from "express"
import {acceptPrescription, createPrescription, prescriptionList,rejectPrescription, userPrescriptions} from "../controllers/prescriptionController.js"
import authMiddleware from "../middleware/auth.js"
import authorizeDoctorMiddleware from "../middleware/authDoctor.js";


const prescriptionRouter = express.Router();

prescriptionRouter.get('/prescriptionlist',prescriptionList);
prescriptionRouter.post('/create',authMiddleware,createPrescription)
prescriptionRouter.post('/userprescriptions',authMiddleware,userPrescriptions)
prescriptionRouter.patch('/:prescriptionId/accept',authMiddleware,authorizeDoctorMiddleware,acceptPrescription);
prescriptionRouter.patch('/:prescriptionId/reject',authMiddleware,authorizeDoctorMiddleware,rejectPrescription);


export default prescriptionRouter;