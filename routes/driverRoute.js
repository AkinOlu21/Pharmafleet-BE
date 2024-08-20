import express from "express";
import authorizeDriverMiddleware from "../middleware/authDriver.js";
import {driverOrders, driverPrescriptionOrders, updatePrescriptionOrderStatus} from "../controllers/orderController.js";

const driverRouter = express.Router();

driverRouter.get("/orders",authorizeDriverMiddleware,driverOrders);
driverRouter.get("/prescriptionorders",authorizeDriverMiddleware,driverPrescriptionOrders);



export default driverRouter;