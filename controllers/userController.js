import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"


//user login
const userLogin = async (req,res) =>{

}

const createToken = (id) =>{
    return jwt.sign({id},process.env.JWT_SECRET)
}

//user registration
const userRegistration = async (req,res) =>{
    const {name,password,email} = req.body;
    try {
        // checking if user already exists
        const exists = await  userModel.findOne({email});
        if (exists){
            return res.json({success:false,message:"user exists"})
        }
        //validating email format and password strength
        if (!validator.isEmail(email)) {
            return res.json({success:false,message:"Enter a valid email "})
            
        } 

        if (password.length<8) {
            return res.json({success:false,message:"Enter a strong password and must be more than 8 characters"})
            
        }

        //hashing and encrypting user password
        const salt = await bcrypt.genSalt(10)
        const  hasshedPassword = await bcrypt.hash(password,salt)

        const newUser = new userModel({
            name:name,
            email:email,
            password:hasshedPassword
        })

        //saving new user in database
        const user = await newUser.save()
        const token = createToken(user._id)
        res.json({success:true,token})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"error"})
    }

}

export {userLogin,userRegistration}