"use client";

import { useState, useEffect } from "react";
import { sendOtp, verifyOtp, completeProfile } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState("PHONE");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [tempToken, setTempToken] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  /* --------------------------------
     Redirect when user is logged in
  --------------------------------- */
  useEffect(() => {
    if (user) {
      router.push("/account");
    }
  }, [user, router]);

  /* --------------------------------
     Handlers
  --------------------------------- */
  const handleSendOtp = async () => {
    await sendOtp(phone);
    setStep("OTP");
  };

  const handleVerifyOtp = async () => {
    const data = await verifyOtp(phone, otp);

    if (data.profileComplete) {
      login(data.token);
    } else {
      setTempToken(data.token);
      setStep("PROFILE");
    }
  };

  const handleCompleteProfile = async () => {
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const data = await completeProfile(tempToken, {
      name: form.name,
      email: form.email,
      password: form.password,
    });

    login(data.token);
  };

  /* --------------------------------
     UI
  --------------------------------- */
  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded space-y-4">
      {step === "PHONE" && (
        <>
          <h1 className="text-xl font-semibold">Login / Sign up</h1>

          <input
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <button
            onClick={handleSendOtp}
            className="w-full bg-black text-white py-2 rounded"
          >
            Send OTP
          </button>
        </>
      )}

      {step === "OTP" && (
        <>
          <h1 className="text-xl font-semibold">Enter OTP</h1>

          <input
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <button
            onClick={handleVerifyOtp}
            className="w-full bg-black text-white py-2 rounded"
          >
            Verify OTP
          </button>
        </>
      )}

      {step === "PROFILE" && (
        <>
          <h1 className="text-xl font-semibold">Complete Profile</h1>

          {["name", "email", "password", "confirmPassword"].map((field) => (
            <input
              key={field}
              type={field.includes("password") ? "password" : "text"}
              placeholder={field}
              value={form[field]}
              onChange={(e) =>
                setForm({ ...form, [field]: e.target.value })
              }
              className="w-full border p-2 rounded"
            />
          ))}

          <button
            onClick={handleCompleteProfile}
            className="w-full bg-black text-white py-2 rounded"
          >
            Continue
          </button>
        </>
      )}

      {/* --------------------------------
          Back to Products (always visible)
      --------------------------------- */}
      <hr className="my-2" />

      <button
        onClick={() => router.push("/products")}
        className="w-full border border-gray-300 py-2 rounded text-gray-700 hover:bg-gray-50"
      >
        ← Back to Products
      </button>
    </div>
  );
}
