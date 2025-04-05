import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://vivekraj2955:8874262627@cluster0.ac35rhl.mongodb.net/food_delivery?').then(()=>console.log("Connected to Database"));
}