import mongoose from "mongoose";

const connectDB =async()=>{
    try {
        mongoose.connection.on('connected',()=>console.log('MongoDB connected'))
        const connection = await mongoose.connect(`${process.env.MONGODB_URI}/car-rental`)
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(1)
    }
}

export default connectDB;