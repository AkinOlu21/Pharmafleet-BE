import express from "express"
import { listOrders, placeOrder, updateOrderStatus, userOrders, verifyOrder, updatePrescriptionOrderStatus} from "../controllers/orderController.js"
import authMiddleware from "../middleware/auth.js";

const orderRouter = express.Router();

orderRouter.post("/place",authMiddleware,placeOrder);
orderRouter.post("/verify",verifyOrder);
orderRouter.post("/userorders",authMiddleware,userOrders);
orderRouter.get("/list",listOrders);
orderRouter.post("/status",updateOrderStatus)
orderRouter.post("/prescriptionstatus",updatePrescriptionOrderStatus) ;  




export default orderRouter;