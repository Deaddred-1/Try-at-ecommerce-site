"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { fetchCart } from "@/lib/api";

export default function ManualUpiPage() {
  const { user, token } = useAuth();
  const router = useRouter();

  const [cart, setCart] = useState(null);
  const [address, setAddress] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [loading, setLoading] = useState(false);

  /* Redirect if not logged in */
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  /* Load cart + address */
  useEffect(() => {
    if (token) loadCart();

    const savedAddress = localStorage.getItem("checkoutAddress");
    if (!savedAddress) {
      router.push("/checkout");
    } else {
      setAddress(JSON.parse(savedAddress));
    }
  }, [token, router]);

  const loadCart = async () => {
    const data = await fetchCart(token);
    setCart(data);
  };

  if (!cart || !address) {
    return <div className="p-6">Loading...</div>;
  }

  const items = cart.items || [];

  const subtotal = items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  const shipping = 0;
  const total = subtotal + shipping;

  const totalItems = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  /* --------------------------
     HANDLE MANUAL PAYMENT CONFIRM
  --------------------------- */
  const handleConfirmPayment = async () => {
    const confirmPay = confirm(
      "Have you completed the UPI payment?"
    );
    if (!confirmPay) return;

    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/orders/manual-upi",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ address }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Order failed");
        setLoading(false);
        return;
      }

      localStorage.removeItem("checkoutAddress");

      router.push(`/order-success?orderId=${data.orderId}`);

    } catch (err) {
      console.error(err);
      alert("Order failed");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-8">

      {/* LEFT SIDE - UPI DETAILS */}
      <div className="space-y-6">

        <button
          onClick={() => router.push("/checkout/payment")}
          className="text-sm text-gray-500 hover:underline"
        >
          ← Back to Payment
        </button>

        <h1 className="text-2xl font-semibold">
          Pay via UPI
        </h1>

        <div className="border rounded p-6 space-y-4 bg-gray-50">

          <p className="text-sm text-gray-600">
            Send the exact amount:
          </p>

          <p className="text-3xl font-bold">
            ₹{total}
          </p>

          <div className="space-y-2 text-sm">
            <p>
              UPI ID:{" "}
              <span className="font-semibold">
                sylvera@upi
              </span>
            </p>
          </div>

          <div className="flex justify-center">
            <img
              src="/upi-qr.png"
              alt="UPI QR"
              className="w-52 h-52 object-contain border rounded"
            />
          </div>
        </div>

        <button
          disabled={loading}
          onClick={handleConfirmPayment}
          className="w-full py-3 bg-black text-white rounded disabled:opacity-50"
        >
          {loading ? "Processing..." : "I Have Paid"}
        </button>
      </div>

      {/* RIGHT SIDE - ORDER SUMMARY */}
      <div className="border rounded p-6 space-y-4">

        <div className="space-y-2">
          <h2 className="font-semibold">Ship To:</h2>

          <div className="text-sm text-gray-700">
            <p className="font-medium">{address.fullName}</p>
            <p>{address.line1}</p>
            {address.line2 && <p>{address.line2}</p>}
            <p>{address.city}, {address.state}</p>
            <p>{address.postalCode}</p>
            <p>{address.country}</p>
            <p className="mt-2">{address.phone}</p>
          </div>
        </div>

        <hr />

        <div
          onClick={() => setShowOrderDetails(!showOrderDetails)}
          className="flex justify-between items-center cursor-pointer"
        >
          <h2 className="font-semibold">
            Order Details ({totalItems} item
            {totalItems > 1 && "s"})
          </h2>
          <span>
            {showOrderDetails ? "▲" : "▼"}
          </span>
        </div>

        {showOrderDetails && (
          <div className="space-y-4 mt-4">
            {items.map((item) => {
                const image = item.image
                  ? `http://localhost:5000${item.image}`
                  : "/placeholder.png";

                return (
                  <div
                    key={item.id}
                    className="flex gap-4 items-center border p-3 rounded"
                  >
                    <img
                      src={image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />

                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <p className="font-semibold">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                );
              })}
          </div>
        )}

        <hr />

        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span>₹{shipping}</span>
        </div>

        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>₹{total}</span>
        </div>

      </div>
    </div>
  );
}
