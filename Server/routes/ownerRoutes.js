import express from "express";
import { addCar, changeRoleToOwner, deleteCar, getDashboardData, getOwnerCars, toggleCarAvailability, updateUserImage } from "../controllers/ownerController.js";
import { protect } from "../middleware/auth.js";
import upload, { handleUploadError } from "../middleware/multer.js";
import { validateCarData } from "../middleware/validation.js";
import { uploadLimiter } from "../middleware/security.js";

const ownerRouter = express.Router();

ownerRouter.post("/change-role", protect, changeRoleToOwner)
ownerRouter.post("/add-car", uploadLimiter, upload.single('image'), handleUploadError, protect, validateCarData, addCar)
ownerRouter.get("/cars", protect, getOwnerCars)
ownerRouter.post("/toggle-car", protect, toggleCarAvailability)
ownerRouter.post("/delete-car", protect, deleteCar)
ownerRouter.get("/dashboard", protect, getDashboardData)
ownerRouter.post("/update-image", uploadLimiter, upload.single('image'), handleUploadError, protect, updateUserImage)



export default ownerRouter;