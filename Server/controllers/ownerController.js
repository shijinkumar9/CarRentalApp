import { format } from "path";
import User from "../models/User.js";
import fs from 'fs'
import Car from "../models/Car.js";
import imagekit from "../configs/imageKit.js";
import Booking from "../models/Booking.js";


//api to change role
export const changeRoleToOwner = async(req,res)=>{
    try {
        const {_id} = req.user;
        await User.findByIdAndUpdate(_id, {role:'owner'})
        res.json({success:true,message:"Now you can list cars"})
    } catch (error) {
        console.log(error.message)
        res.json({success:false, message:error.message})
    }
}

//Api to list car
export const addCar = async(req, res)=>{
    try {
        const {_id} = req.user;
        let car = JSON.parse(req.body.carData);
        const imageFile = req.file;

        //upload image to imagekit
        const fileBuffer = fs.readFileSync(imageFile.path)
        const response = await imagekit.upload({
            file:fileBuffer,
            fileName:imageFile.originalname,
            folder:'/cars'
        })

        //for URL Generation works for both images and videos

        // optimization through imagekit URL transformation
        var optimizedImageURL = imagekit.url({
            path : response.filePath,
            transformation : [
                {width:'1280'},//width resizing
                {quality:'auto'},//auto compression
                {format: 'webp'} //convert to modern format
            ]
        });

        const image = optimizedImageURL;
        await Car.create({...car, owner:_id,image})


        res.json({success:true, message:"Car added successfully"})
    } catch (error) {
        console.log(error.message)
        res.json({success:false, message:error.message})
    }
}

//API to list owner cars
export const getOwnerCars = async(req, res)=>{
    try {
        const {_id} = req.user;
        const cars = await Car.find({owner:_id})
        if(!cars){
            return res.json({success:false, message:"No cars found"})
        }
        //console.log(cars)
        res.json({success:true, cars})
    } catch (error) {
        console.log(error.message)
        res.json({success:false, message:error.message})
    }
}

//API to toggle car availability
export const toggleCarAvailability = async(req, res)=>{
    try {
        const {_id} = req.user;
        const {carId} = req.body;
        const car = await Car.findById(carId);

        //Checking if car belongs to owner
        if(car.owner.toString() !== _id.toString()){
            return res.json({success:false, message:"Car does not belong to you"})
        }
        car.isAvaliable = !car.isAvaliable;
        await car.save();

        res.json({success:true, message:"Car availability toggled"})
    } catch (error) {
        console.log(error.message)
        res.json({success:false, message:error.message})
    }
}

//API to delete car
export const deleteCar = async(req, res)=>{
    try {
        const {_id} = req.user;
        const {carId} = req.body;
        const car = await Car.findById(carId);

        //Checking if car belongs to owner
        if(car.owner.toString() !== _id.toString()){
            return res.json({success:false, message:"Car does not belong to you"});
        }
        car.owner =null;
        car.isAvaliable = false;
        await car.save()

        res.json({success:true, message:"Car removed successfully"})
    } catch (error) {
        console.log(error.message)
        res.json({success:false, message:error.message})
    }
}

//API to get dashboard data
export const getDashboardData = async(req, res)=>{
    try {
        const {_id,role} = req.user;
        if(role!=='owner'){
            return res.json({success:false, message:"You are not an owner"});
        }
        const cars = await Car.find({owner:_id})
        const bookings = await Booking.find({owner:_id}).populate('car').select("-user.password").sort({createdAt:-1});

        const pendingBookings = await Booking.find({owner:_id, status:'pending'})
        const completedBookings = await Booking.find({owner:_id, status:'completed'})

        //calculate monthly revenue from booking where status is confirmed
        const monthlyRevenue = bookings.slice().filter(booking=>booking.status ==='confirmed').reduce((acc,booking)=>acc+booking.price,0)

        const dashboardData = {
            totalCars:cars.length,
            totalBookings:bookings.length,
            pendingBookings:pendingBookings.length,
            completedBookings:completedBookings.length,
            recentBookings:bookings.slice(0,3),
            monthlyRevenue
        }

        res.json({success:true, dashboardData})
    } catch (error) {
        console.log(error.message)
        res.json({success:false, message:error.message})
    }
}

//API to update user image

export const updateUserImage =async(req,res)=>{
    try {
        const {_id} = req.user;
        const imageFile = req.file;

        //upload image to imagekit
        const fileBuffer = fs.readFileSync(imageFile.path)
        const response = await imagekit.upload({
            file:fileBuffer,
            fileName:imageFile.originalname,
            folder:'/users'
        })

        //for URL Generation works for both images and videos

        // optimization through imagekit URL transformation
        var optimizedImageURL = imagekit.url({
            path : response.filePath,
            transformation : [
                {width:'400'},//width resizing
                {quality:'auto'},//auto compression
                {format: 'webp'} //convert to modern format
            ]
        });

        const image = optimizedImageURL;

        await User.findByIdAndUpdate(_id, {image});
        res.json({success:true, message:"Image updated successfully"})
    } catch (error) {
        console.log(error.message)
        res.json({success:false, message:error.message})
        
    }
}