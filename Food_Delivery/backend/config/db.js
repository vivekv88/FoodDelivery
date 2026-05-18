import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config({ override: true })

const normalizeMongoUri = (uri = "") => uri.trim().replace(/\?$/, "")

export const connectDB = async () => {
    const primaryUri = normalizeMongoUri(process.env.MONGODB_URI)
    const fallbackUri = normalizeMongoUri(process.env.MONGODB_URI_LOCAL || "mongodb://127.0.0.1:27017/food_delivery")

    const connectOptions = {
        serverSelectionTimeoutMS: 10000,
    }

    if (!primaryUri) {
        if (!fallbackUri) {
            throw new Error("No MongoDB connection string found. Set MONGODB_URI or MONGODB_URI_LOCAL.")
        }

        await mongoose.connect(fallbackUri, connectOptions)
        console.log("Connected to fallback Database")
        return
    }

    try {
        await mongoose.connect(primaryUri, connectOptions)
        console.log("Connected to Database")
    } catch (primaryError) {
        console.error("Primary MongoDB connection failed:", primaryError.message)

        if (fallbackUri && fallbackUri !== primaryUri) {
            console.log("Trying fallback MongoDB connection...")
            await mongoose.connect(fallbackUri, connectOptions)
            console.log("Connected to fallback Database")
            return
        }

        throw primaryError
    }
}