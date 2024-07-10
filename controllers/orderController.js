import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js"
import Stripe from "stripe"

//setting up stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


// logic for placing the user order on the frontend
const placeOrder = async (req,res) =>{

    const frontend_url = "http://localhost:5173"

    try { //creating a new order
        const newOrder = new orderModel({
            userId:req.body.userId,
            items:req.body.items,
            amount:req.body.amount,
            address:req.body.address,

        })
        await newOrder.save(); //saving the new order in the database
        await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}}); //cleaning the users cart data after saving the new order

        //taking the items in the new order and using them for the stripe payment in line_items
        const line_items = req.body.items.map((item)=>({
            price_data:{
                currency:"gbp",
                product_data:{
                    name:item.name
                },
                unit_amount:item.price*100 //converting pounds to pence
            },
            quantity:item.quantity,
        }))

        //addin delivery charges to the item order
        line_items.push({
            price_data:{
                currency:"gbp",
                product_data:{
                    name:"Delivery charges"
                },
                unit_amount:2.5*100
            },
            quantity:1
        })

        //creating a payment session
        const session = await stripe.checkout.sessions.create({
            line_items:line_items,
            mode:"payment",
            success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`
        })

        res.json({success:true,session_url:session.url})//sent the session as a response
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error, Payment failed!!"})
    }
}


//temporary payment verification system instead of using webhooks
const verifyOrder = async (req,res) =>{
    const {orderId,success} = req.body;
    try {
        if (success=="true") {
            await orderModel.findByIdAndUpdate(orderId,{payment:true});
            res.json({success:true,message:"Payment complete"})
        } else{
            await orderModel.findByIdAndDelete(orderId);
            res.json({success:false,message:"Payment incomplete"})
        }
        
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"error"})
    }
}

export {placeOrder,verifyOrder}