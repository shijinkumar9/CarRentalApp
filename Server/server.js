import express from "express"
import cors from "cors"
import config from "./configs/env.js";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import { securityHeaders, generalLimiter, authLimiter, uploadLimiter } from "./middleware/security.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

//Initialise the express app
const app = express();

await connectDB()

// Security middleware (must be first)
app.use(securityHeaders);
app.use(generalLimiter);

// CORS configuration (allow configured origin and common localhost dev ports)
const allowedOrigins = new Set([
    config.FRONTEND_URL,
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    'http://localhost:5177',
    'http://localhost:5178',
    'http://localhost:5179',
]);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true); // allow non-browser tools
        if (allowedOrigins.has(origin)) return callback(null, true);
        return callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.use("/api/user", userRouter);
app.use("/api/owner", ownerRouter);
app.use("/api/bookings", bookingRouter);

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

app.listen(config.PORT, () => {
    // Server started successfully
});
