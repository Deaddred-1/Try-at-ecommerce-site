"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AddressBook from "@/components/AddressBook";

export default function AccountPage() {
  const { user, loading, logout, token } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  /* --------------------------------
     Redirect if not logged in
  --------------------------------- */
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  /* --------------------------------
     Load User Orders
  --------------------------------- */
  useEffect(() => {
    if (user && token && user.role !== "ADMIN") {
      loadOrders();
    }
  }, [user, token]);

  const loadOrders = async () => {
    try {
      setOrdersLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/orders/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Failed to load orders", err);
    } finally {
      setOrdersLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">

      {/* Back */}
      <button
        onClick={() => router.push("/products")}
        className="text-sm text-gray-500 hover:underline"
      >
        ← Back to Products
      </button>

      <h1 className="text-2xl font-semibold">
        My Account
      </h1>

      {/* Profile */}
      <div className="border rounded p-4 space-y-2">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Email:</strong> {user.email || "Not added"}</p>
      </div>

      {/* ===============================
          NORMAL USER VIEW
      =============================== */}
      {user.role !== "ADMIN" && (
        <div className="grid md:grid-cols-2 gap-6">

          {/* My Orders */}
          <div className="border rounded p-4 space-y-4">
            <h2 className="font-semibold text-lg">
              My Orders
            </h2>

            {ordersLoading && (
              <p>Loading orders...</p>
            )}

            {!ordersLoading && orders.length === 0 && (
              <p className="text-gray-500">
                You have no orders yet.
              </p>
            )}

            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border p-4 rounded space-y-3"
                >
                  {/* Header */}
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-500">
                        Order ID
                      </p>
                      <p className="font-mono text-sm">
                        {order.id}
                      </p>
                    </div>

                    <div className="text-right">
                      <StatusBadge status={order.status} />
                      <p className="font-semibold mt-1">
                        ₹{order.total}
                      </p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-1 text-sm">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between"
                      >
                        <span>
                          {item.product.name} × {item.quantity}
                        </span>
                        <span>
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Address */}
                  <div className="text-xs text-gray-500 border-t pt-2">
                    <p className="font-medium">
                      Shipped to:
                    </p>
                    <p>{order.address.fullName}</p>
                    <p>{order.address.line1}</p>
                    <p>
                      {order.address.city}, {order.address.state}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Address Book */}
          <div className="border rounded p-4">
            <AddressBook />
          </div>
        </div>
      )}

      {/* ===============================
          ADMIN PANEL
      =============================== */}
      {user.role === "ADMIN" && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            Admin Panel
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <button
              onClick={() => router.push("/account/orders")}
              className="border p-6 rounded hover:bg-gray-50 text-left"
            >
              <h3 className="font-semibold">
                View Orders
              </h3>
              <p className="text-sm text-gray-500">
                Manage all customer orders
              </p>
            </button>

            <button
              onClick={() => router.push("/account/products")}
              className="border p-6 rounded hover:bg-gray-50 text-left"
            >
              <h3 className="font-semibold">
                Manage Products
              </h3>
              <p className="text-sm text-gray-500">
                Add, update or remove products
              </p>
            </button>
          </div>
        </div>
      )}

      {/* Logout */}
      <button
        onClick={() => {
          logout();
          router.push("/login");
        }}
        className="px-6 py-2 bg-black text-white rounded"
      >
        Logout
      </button>
    </div>
  );
}


/* ===============================
   STATUS BADGE COMPONENT
================================= */
function StatusBadge({ status }) {
  const colors = {
    PENDING: "bg-yellow-100 text-yellow-700",
    SHIPPED: "bg-blue-100 text-blue-700",
    DELIVERED: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`text-xs px-3 py-1 rounded ${colors[status] || "bg-gray-100 text-gray-700"}`}
    >
      {status}
    </span>
  );
}
