import userModel from "../models/userModel.js"

//add items to cart
const addToCart = async (req,res) =>{
    try {

        const userId = req.user.id;
        let userData = await userModel.findOne({_id:userId});
        let cartData = await userData.cartData;        
        if(!cartData[req.body.itemId])
        {
            cartData[req.body.itemId] = 1;
        }
        else{
            cartData[req.body.itemId] += 1;
        }
        await userModel.findByIdAndUpdate(userId,{cartData});
        res.json({success:true,message:"Item added to cart"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"error adding to cart"})
    }
}


//remove items from cart
const removeFromCart = async (req,res) =>{
   
   try {

    const userId = req.user.id;
        let userData = await userModel.findById(userId);
        let cartData = await userData.cartData;
        if (cartData[req.body.itemId]>0) {
            cartData[req.body.itemId] -= 1;
            
        } 
        await userModel.findByIdAndUpdate(userId,{cartData})
        res.json({success:true,message:"Item removed from cart"})
   } catch (error) {
    console.log(error);
    res.json({success:false,message:"error"})
   } 
}


// fetch cart data
const getCart = async (req,res) =>{
    try {
        const userId = req.user.id;
        let userData = await userModel.findById(userId);
        let cartData = await userData.cartData;
        res.json({success:true,cartData})
        } catch (error) {
        console.log(error);
        res.json({success:false,message:"error"})
    }
}

export {addToCart,removeFromCart,getCart}