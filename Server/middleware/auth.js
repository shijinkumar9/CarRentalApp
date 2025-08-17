import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async(req,res,next)=>{
    const token = req.headers.authorization;
    if(!token){
        return res.json({success:false, message:'Not Authorized balle'})
    }
    try {
        const decoded = jwt.decode(token ,process.env.JWT_SECRET)
        const userId = decoded.userId
        if(!userId){
            return res.json({success:false, message:'Not Authorized'})
        }
        req.user = await User.findById(userId).select("-password")
        next();
    } catch (error) {
        return res.json({success:false, message:error.message})
    }
}