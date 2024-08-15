import express from "express"
import { listOrders, placeOrder, updateOrderStatus, userOrders, verifyOrder, driverOrders} from "../controllers/orderController.js"
import authorizeDriverMiddleware from "../middleware/authDriver.js";
import authMiddleware from "../middleware/auth.js";

const orderRouter = express.Router();

orderRouter.post("/place",authMiddleware,placeOrder);
orderRouter.post("/verify",verifyOrder);
orderRouter.post("/userorders",authMiddleware,userOrders);
orderRouter.get("/list",listOrders);
orderRouter.post("/status",updateOrderStatus)



export default orderRouter;