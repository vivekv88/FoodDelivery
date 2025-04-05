import foodModel from "../models/foodmodel.js";
import fs from 'fs'

const addfood = async (req,res) => {

    let image_filename = `${req.file.filename}`

    let food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename
    })

    try {
        await food.save()
        res.json({success:true,message:"Food Added"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }

}

 // all food list

 const listFood = async (req,res) => {
        
 }

export {addfood,listFood}