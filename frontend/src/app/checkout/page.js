"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { fetchCart } from "@/lib/api";

export default function CheckoutPage() {
  const { user, token } = useAuth();
  const router = useRouter();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [cart, setCart] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  /* Redirect if not logged in */
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  /* Load data */
  useEffect(() => {
    if (token) {
      loadCart();
      loadAddresses();
    }
  }, [token]);

  const loadCart = async () => {
    const data = await fetchCart(token);
    setCart(data);
  };

  const loadAddresses = async () => {
    const res = await fetch("http://localhost:5000/api/addresses", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setAddresses(data);
  };

  /* Add Address Inline */
  const handleAddAddress = async () => {
    const res = await fetch("http://localhost:5000/api/addresses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newAddress),
    });

    if (!res.ok) {
      alert("Failed to save address");
      return;
    }

    setShowAddForm(false);
    setNewAddress({
      fullName: "",
      phone: "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
    });

    await loadAddresses();
  };

  /* Continue to Payment */
  const handleContinue = () => {
    if (!selectedAddressId) {
      alert("Select an address");
      return;
    }

    const selectedAddress = addresses.find(
      (a) => a.id === selectedAddressId
    );

    localStorage.setItem(
      "checkoutAddress",
      JSON.stringify(selectedAddress)
    );

    router.push("/checkout/payment");
  };

  if (!cart) return <div className="p-6">Loading...</div>;

  const items = cart.items || [];

  const subtotal = items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  const shipping = 0; // kept in logic
  const total = subtotal + shipping;

  const totalItems = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">

      {/* BACK BUTTON */}
      <button
        onClick={() => router.push("/products")}
        className="text-sm text-gray-500 hover:underline"
      >
        ← Continue Shopping
      </button>

      <div className="grid md:grid-cols-2 gap-8">

        {/* LEFT SIDE - SHIPPING */}
        <div className="space-y-6">
          <h1 className="text-2xl font-semibold">
            Shipping
          </h1>

          {addresses.length > 0 && (
            <div className="space-y-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => setSelectedAddressId(addr.id)}
                  className={`border p-4 rounded cursor-pointer transition
                    ${
                      selectedAddressId === addr.id
                        ? "border-black ring-2 ring-black"
                        : "border-gray-300"
                    }
                  `}
                >
                  <p className="font-medium">{addr.fullName}</p>
                  <p>{addr.line1}</p>
                  <p>{addr.city}, {addr.state}</p>
                  <p>{addr.postalCode}</p>
                  <p>{addr.phone}</p>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="text-sm underline"
          >
            + Add New Address
          </button>

          {showAddForm && (
            <div className="border p-4 rounded space-y-3">
              {Object.keys(newAddress).map((field) => (
                <input
                  key={field}
                  placeholder={field}
                  value={newAddress[field]}
                  onChange={(e) =>
                    setNewAddress({
                      ...newAddress,
                      [field]: e.target.value,
                    })
                  }
                  className="w-full border p-2 rounded"
                />
              ))}

              <button
                onClick={handleAddAddress}
                className="bg-black text-white px-4 py-2 rounded"
              >
                Save Address
              </button>
            </div>
          )}

          <button
            onClick={handleContinue}
            disabled={items.length === 0}
            className="px-6 py-3 bg-black text-white rounded disabled:bg-gray-400"
          >
            Continue to Payment
          </button>
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
            <span>{showOrderDetails ? "▲" : "▼"}</span>
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
            <span>Total</span>
            <span>₹{total}</span>
          </div>

        </div>
      </div>
    </div>
  );
}
