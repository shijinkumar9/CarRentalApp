import mongoose from "mongoose";
import config from "./env.js";

const connectDB = async()=>{
    try {
        mongoose.connection.on('connected',()=>{})
        const connection = await mongoose.connect(`${config.MONGODB_URI}/car-rental`)
    } catch (error) {
        // Log error and exit
        process.exit(1)
    }
}

export default connectDB;