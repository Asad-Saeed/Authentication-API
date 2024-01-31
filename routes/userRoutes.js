import { Router } from "express";
import UserController from "../controllers/userConstroller.js";
const router = Router();
// Public Routes
router.post("/register", UserController.userRegistration);
router.post("/login", UserController.userLogin);

// Protected Routes

export default router;
