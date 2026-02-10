import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const OTP_EXPIRY_MINUTES = Number(process.env.OTP_EXPIRY_MINUTES || 5);

export const sendOtp = async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: "Phone is required" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpHash = await bcrypt.hash(otp, 10);

  const expiresAt = new Date(
    Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
  );

  await prisma.otpVerification.deleteMany({ where: { phone: phone } });

  await prisma.otpVerification.create({
    data: {
      phone: phone,
      otpHash,
      expiresAt,
    },
  });

  console.log(`OTP for ${phone}: ${otp}`);

  res.json({ message: "OTP sent" });
};

export const verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;

  const record = await prisma.otpVerification.findFirst({
    where: { phone: phone },
    orderBy: { createdAt: "desc" },
  });

  if (!record || record.expiresAt < new Date()) {
    return res.status(400).json({ message: "OTP expired or invalid" });
  }

  const isValid = await bcrypt.compare(otp, record.otpHash);

  if (!isValid) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  await prisma.otpVerification.deleteMany({ where: { phone: phone } });

  let user = await prisma.user.findUnique({ where: { phone } });

  if (!user) {
    //New user → temporary JWT
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
};

export const completeProfile = async (req, res) => {
  const { name, email, password } = req.body;
  const { phone } = req.user;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
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
};

export const getMe = async (req, res) => {
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
};