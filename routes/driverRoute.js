import express from "express";
import authorizeDriverMiddleware from "../middleware/authDriver.js";
import {driverOrders} from "../controllers/orderController.js";

const driverRouter = express.Router();

driverRouter.get("/orders",authorizeDriverMiddleware,driverOrders)


export default driverRouter;