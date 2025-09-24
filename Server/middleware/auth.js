import jwt from "jsonwebtoken";
import User from "../models/User.js";
import config from "../configs/env.js";

export const protect = async(req,res,next)=>{
    let token = req.headers.authorization;
    if(!token){
        return res.status(401).json({success:false, message:'Not Authorized'})
    }
    try {
        // Support both "Bearer <token>" and raw token formats
        if (typeof token === 'string' && token.startsWith('Bearer ')) {
            token = token.slice(7).trim();
        }
        // Verify the token signature and decode
        const decoded = jwt.verify(token, config.JWT_SECRET)
        const userId = decoded.userId
        if(!userId){
            return res.status(401).json({success:false, message:'Not Authorized'})
        }
        const user = await User.findById(userId).select("-password")
        if(!user){
            return res.status(401).json({success:false, message:'User not found'})
        }
        req.user = user
        next();
    } catch (error) {
        // Don't expose error details in production
        return res.status(401).json({success:false, message:'Invalid token'})
    }
}