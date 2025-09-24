import Joi from 'joi';

// User registration validation
export const validateUserRegistration = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required().trim(),
        email: Joi.string().email().required().trim().lowercase(),
        password: Joi.string().min(8).max(128).required()
            .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]'))
            .messages({
                'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'
            })
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }
    next();
};

// User login validation
export const validateUserLogin = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required().trim().lowercase(),
        password: Joi.string().required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }
    next();
};

// Car data validation
export const validateCarData = (req, res, next) => {
    const schema = Joi.object({
        brand: Joi.string().min(2).max(50).required().trim(),
        model: Joi.string().min(2).max(50).required().trim(),
        year: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1).required(),
        category: Joi.string().valid('economy', 'compact', 'midsize', 'fullsize', 'luxury', 'suv', 'van').required(),
        seating_capacity: Joi.number().integer().min(2).max(8).required(),
        fuel_type: Joi.string().valid('gasoline', 'diesel', 'electric', 'hybrid').required(),
        transmission: Joi.string().valid('manual', 'automatic').required(),
        pricePerDay: Joi.number().min(10).max(1000).required(),
        location: Joi.string().min(2).max(100).required().trim(),
        description: Joi.string().min(10).max(500).required().trim()
    });

    const { error } = schema.validate(req.body.carData ? JSON.parse(req.body.carData) : req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }
    next();
};

// Booking validation
export const validateBooking = (req, res, next) => {
    const schema = Joi.object({
        car: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
        pickupDate: Joi.date().min('now').required(),
        returnDate: Joi.date().min(Joi.ref('pickupDate')).required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }
    next();
};

// Availability check validation
export const validateAvailabilityCheck = (req, res, next) => {
    const schema = Joi.object({
        location: Joi.string().min(2).max(100).required().trim(),
        pickupdate: Joi.date().min('now').required(),
        returnDate: Joi.date().min(Joi.ref('pickupdate')).required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }
    next();
};

// Booking status validation
export const validateBookingStatus = (req, res, next) => {
    const schema = Joi.object({
        bookingId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
        status: Joi.string().valid('pending', 'confirmed', 'cancelled').required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }
    next();
};