import jwt from "jsonwebtoken"
import userModel from "../models/userModel.js";

const authorizeDoctorMiddleware = async (req,res,next) =>{  
    const {token} = req.headers;
    if (!token) {
        return res.json({succes:false,message:"NOT AUTHORIZED PLEASE lOGIN"});
    }

    try {
        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //Finding the GP with the associated token in the database
        const user = await userModel.findById(decoded.id);
        if(!user){
            return res.json({success:false,message:"User was not found"});
        }

        //Checking if the user is the GP
        if (user.role !=="GP") {
            return res.json({success:false,message:"Access denied. Only Doctors can perform this action"});
        }

        //saving the user info to the request then proceeding
        req.user = user;
        next();
        
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Token is invalid or has expired"})
    }

}

export default authorizeDoctorMiddleware;