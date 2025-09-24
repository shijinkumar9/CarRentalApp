
import express from 'express'
import { changeBookingStatus, checkAvailabilityOfCar ,createBooking, getOwnerBookings, getUserBookings} from '../controllers/bookingController.js'
import { protect } from '../middleware/auth.js'
import { validateAvailabilityCheck, validateBooking, validateBookingStatus } from '../middleware/validation.js'


const bookingRouter = express.Router()

bookingRouter.post('/check-availability', validateAvailabilityCheck, checkAvailabilityOfCar)
bookingRouter.post('/create', protect, validateBooking, createBooking)
bookingRouter.get('/user', protect, getUserBookings) 
bookingRouter.get('/owner', protect, getOwnerBookings)  
bookingRouter.post('/change-status', protect, validateBookingStatus, changeBookingStatus)  

export default bookingRouter
