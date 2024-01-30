import express from "express";
import { Router } from "express";
import UserController from "../controllers/userConstroller.js";
const router = Router();
// Public Routes
router.post("/register", UserController.userRegistration);
// Protected Routes

export default router;
