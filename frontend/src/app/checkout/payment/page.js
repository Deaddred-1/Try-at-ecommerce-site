"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { fetchCart } from "@/lib/api";

export default function PaymentPage() {
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

  /* Load cart + selected address */
  useEffect(() => {
    if (token) {
      loadCart();
    }

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

  /* --------------------------
     HANDLE COD ORDER
  --------------------------- */
  const handleCOD = async () => {
    const confirmOrder = confirm("Confirm Cash on Delivery order?");
    if (!confirmOrder) return;

    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/orders",
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

  const handleManualUpi = () => {
    router.push("/checkout/payment/upi");
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

  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-8">

      {/* LEFT SIDE - PAYMENT OPTIONS */}
      <div className="space-y-6">

        {/* ✅ BACK BUTTON ADDED */}
        <button
          onClick={() => router.push("/checkout")}
          className="text-sm text-gray-500 hover:underline"
        >
          ← Back to Shipping
        </button>

        <h1 className="text-2xl font-semibold">
          Payment
        </h1>

        {/* SHIP TO SECTION */}
        <div className="border rounded p-4 space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold">Ship To:</h2>
            <button
              onClick={() => router.push("/checkout")}
              className="text-sm underline"
            >
              Edit
            </button>
          </div>

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

        {/* PAYMENT OPTIONS */}
        <div className="space-y-4">

          <button
            disabled={loading}
            className="w-full py-3 bg-purple-600 text-white rounded disabled:opacity-50"
            onClick={handleManualUpi}
          >
            Pay via UPI (Scan QR)
          </button>

          <button
            disabled={loading}
            className="w-full py-3 bg-black text-white rounded disabled:opacity-50"
            onClick={handleCOD}
          >
            {loading ? "Placing Order..." : "Cash on Delivery"}
          </button>

        </div>
      </div>

      {/* RIGHT SIDE - ORDER SUMMARY */}
      <div className="border rounded p-6 space-y-4">

        <div
          onClick={() => setShowOrderDetails(!showOrderDetails)}
          className="flex justify-between items-center cursor-pointer border-b pb-2"
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
          <span>Cart Subtotal</span>
          <span>₹{subtotal}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span>₹{shipping}</span>
        </div>

        <div className="flex justify-between font-semibold text-lg">
          <span>Order Total</span>
          <span>₹{total}</span>
        </div>

      </div>
    </div>
  );
}