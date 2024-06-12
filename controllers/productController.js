import productModel from "../models/productsModel.js";
import fs from 'fs'

//add pharmacy product

const addProduct =  async (req,res) => {

    let image_filename = `${req.file.filename}`;

    const product = new productModel({
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
        category:req.body.category,
        image:image_filename
    })

    try {
        await product.save();
        res.json({succes:true,message:"Product was added"})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Error adding product"})
        
    }
}

export {addProduct}