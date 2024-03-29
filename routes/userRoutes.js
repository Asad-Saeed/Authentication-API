import { Router } from "express";
import UserController from "../controllers/userConstroller.js";
import checkUserAuth from "../middlewares/auth-middleware.js";
const router = Router();

// Route level middleware to protect route
router.use("/changepassword", checkUserAuth);
router.use("/loggeduser", checkUserAuth);

// Public Routes
router.post("/register", UserController.userRegistration);
router.post("/login", UserController.userLogin);
router.post("/send-reset-password-email", UserController.sendResetPasswordEmail);
router.post("/reset-password/:id/:token", UserController.userPasswordReset);

// Protected Routes
router.post("/changepassword", UserController.changeUserPassword);
router.get("/loggeduser", UserController.loggedUserData);



export default router;
