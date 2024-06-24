import { log } from "console";
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


//listing all products
const listProduct = async (req,res) => {
    try {
        const products = await productModel.find({});
        res.json({succes:true,data:products})
    } catch (error) {
        console.log(error);
        res.json({succes:false,message:"Error"})
        
    }
}

//removing product
const removeProduct = async (req,res) => {
    try {
        const product = await productModel.findById(req.body.id);
        fs.unlink(`uploads/${product.image}`,()=>{})

        await productModel.findByIdAndDelete(req.body.id);
        res.json({success:true,message:"Product sccessfully removed"})
        
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"error"})
    }
}

export {addProduct,listProduct,removeProduct}