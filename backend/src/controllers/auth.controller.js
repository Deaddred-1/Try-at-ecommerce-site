import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { sendEmail } from "../services/email.service.js";
import { welcomeEmailTemplate } from "../services/templates.js";
import { sendOtpSms } from "../services/sms.service.js";

const OTP_EXPIRY_MINUTES = Number(process.env.OTP_EXPIRY_MINUTES || 5);

/* ============================================================
   SEND OTP (SMS SIMULATED)
============================================================ */
export const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone is required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);

    const expiresAt = new Date(
      Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
    );

    // Remove old OTPs
    await prisma.otpVerification.deleteMany({
      where: { phone },
    });

    await prisma.otpVerification.create({
      data: {
        phone,
        otpHash,
        expiresAt,
      },
    });

    // 🔥 Use SMS service (currently simulated)
    sendOtpSms(phone, otp);

    res.json({ message: "OTP sent" });

  } catch (err) {
    console.error("SEND OTP ERROR:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};


/* ============================================================
   VERIFY OTP
============================================================ */
export const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const record = await prisma.otpVerification.findFirst({
      where: { phone },
      orderBy: { createdAt: "desc" },
    });

    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired or invalid" });
    }

    const isValid = await bcrypt.compare(otp, record.otpHash);

    if (!isValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    await prisma.otpVerification.deleteMany({
      where: { phone },
    });

    let user = await prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      // New user → temporary JWT
      const token = jwt.sign(
        { phone, profileComplete: false },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      );

      return res.json({
        token,
        profileComplete: false,
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
        profileComplete: true,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      profileComplete: true,
    });

  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    res.status(500).json({ message: "OTP verification failed" });
  }
};


/* ============================================================
   COMPLETE PROFILE (ACCOUNT CREATION)
============================================================ */
export const completeProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const { phone } = req.user;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        phone,
        name,
        email,
        password: hashedPassword,
      },
    });

    // 🔥 Send Welcome Email
    if (user.email) {
      await sendEmail({
        to: user.email,
        subject: "Welcome to Sylera ✨",
        html: welcomeEmailTemplate(user.name),
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
        profileComplete: true,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });

  } catch (err) {
    console.error("COMPLETE PROFILE ERROR:", err);
    res.status(500).json({
      message: "Failed to complete profile",
      error: err.message,
    });
  }
};


/* ============================================================
   GET CURRENT USER
============================================================ */
export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        role: true,
      },
    });

    res.json(user);

  } catch (err) {
    console.error("GET ME ERROR:", err);
    res.status(500).json({ message: "Failed to fetch user" });
  }
};