import express from "express";
import {
  sendOtp,
  verifyOtp,
  completeProfile,
  getMe,
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/complete-profile", requireAuth, completeProfile);
router.get("/me", requireAuth, getMe);

export default router;
