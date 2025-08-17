import Booking from "../models/Booking.js";
import Car from "../models/Car.js";


//Function to check availability of car for a given date

const checkAvailability = async(car, pickupdate,returnDate) => {
    const bookings = await Booking.find({
        car,
        pickupDate:{$lte:returnDate},
        returnDate:{$gte:pickupdate},
    })
    return bookings.length ===0;
};

//API to check availability of cars for the given date and location

export const checkAvailabilityOfCar = async(req,res)=>{
    try {
        const {location, pickupdate, returnDate} = req.body;
        //fetch all available cars in the location
        const cars = await Car.find({location, isAvaliable:true});

        //check car available for the given data range using promise
        const availableCarsPromises = cars.map(async(car)=>{
            const isAvailable = await checkAvailability(car._id, pickupdate, returnDate)
            return {...car._doc,isAvailable:isAvailable}
        })

        let availableCars = await Promise.all(availableCarsPromises);
        availableCars = availableCars.filter((car)=>car.isAvailable===true);
        res.json({success:true, availableCars})
    } catch (error) {
        console.log(error.message)
        res.json({success:false, message:error.message})
    }
}

//API to book a car
export const createBooking = async(req, res)=>{
    try {
        const {_id} = req.user;
        const {car, pickupDate, returnDate} = req.body;

        const isAvailable = await checkAvailability(car, pickupDate, returnDate);
        if(!isAvailable){
            return res.json({success:false, message:"Car is not available for the given date"});
        }

        const carData = await Car.findById(car)

        //Calculate price based on pickupDate and returndate
        const picked = new Date(pickupDate);
        const returned = new Date(returnDate);
        const noOfDays = Math.ceil((returned-picked)/(1000*60*60*24));
        const price = noOfDays * carData.pricePerDay;
        await Booking.create({
            car,
            owner:carData.owner,
            user:_id,
            pickupDate,
            returnDate,
            price
        })

        res.json({success:true, message:"Car booked successfully"})
    } catch (error) {
        console.log(error.message)
        res.json({success:false, message:error.message})
    }
}

//API to list user Bookings
export const getUserBookings = async(req, res)=>{
    try {
        const {_id} = req.user;
        const bookings = await Booking.find({user:_id}).populate('car').sort({createdAt:-1});
        res.json({success:true, bookings})
    } catch (error) {
        console.log(error.message)
        res.json({success:false, message:error.message})
    }
}

//API to list owner bookings
export const getOwnerBookings = async(req, res)=>{
    try {
        if(req.user.role!=="owner"){
            return res.json({success:false, message:"Unauthorized"})
        }
        const {_id} = req.user;
        const bookings = await Booking.find({owner:req.user._id}).populate('car user').select("-user.password").sort({createdAt:-1});
        res.json({success:true, bookings})
    } catch (error) {
        console.log(error.message)
        res.json({success:false, message:error.message})
    }
}

//API to change the booking status
export const changeBookingStatus = async(req, res)=>{
    try {
        const {_id} = req.user;
        const {bookingId, status} = req.body;

        const booking = await Booking.findById(bookingId);
        if(booking.owner.toString()!==_id.toString()){
            return res.json({success:false, message:"Not Authorize"})
        }
        booking.status = status;
        await booking.save();
        res.json({success:true, message:"Booking status updated successfully"})
    } catch (error) {
        console.log(error.message)
        res.json({success:false, message:error.message})
    }
}