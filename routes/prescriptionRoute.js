import express from "express"
import {acceptPrescription, createPrescription, prescriptionList, prescriptionStatus, rejectPrescription} from "../controllers/prescriptionController.js"
import authMiddleware from "../middleware/auth.js"


const prescriptionRouter = express.Router();

prescriptionRouter.get('/prescriptionlist',prescriptionList);
prescriptionRouter.post('/create',authMiddleware,createPrescription)
prescriptionRouter.post('/prescriptionstatus',prescriptionStatus);
prescriptionRouter.post('/accept',acceptPrescription);
prescriptionRouter.post('/reject',rejectPrescription);


export default prescriptionRouter;