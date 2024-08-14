import express from "express";
import { pharmacyRegistration, pharmaLogin } from "../controllers/pharmacyController.js";
import authMiddleware from "../middleware/auth.js";
import { getPharmacyNotifications, markNotificationAsRead } from "../controllers/notificationController.js";



const pharmacyRouter = express.Router();

pharmacyRouter.post('/pharmaregister',pharmacyRegistration)
pharmacyRouter.post('/pharmalogin',pharmaLogin)
pharmacyRouter.get('/notifications',authMiddleware,getPharmacyNotifications)
pharmacyRouter.patch('/notifications/:notificationId',authMiddleware,markNotificationAsRead)

export default pharmacyRouter;