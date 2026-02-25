const BASE_URL = "http://localhost:5000/api/auth";

export async function sendOtp(phone) {
  const res = await fetch(`${BASE_URL}/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  });

  if (!res.ok) throw new Error("Failed to send OTP");
}

export async function verifyOtp(phone, otp) {
  const res = await fetch(`${BASE_URL}/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, otp }),
  });

  if (!res.ok) throw new Error("Invalid OTP");

  return res.json(); // { token, profileComplete }
}

export async function completeProfile(token, payload) {
  const res = await fetch(`${BASE_URL}/complete-profile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Profile completion failed");

  return res.json(); // { token }
}
