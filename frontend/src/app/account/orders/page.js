"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AdminOrdersPage() {
  const { user, loading, token } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  /* --------------------------
     Redirect if not admin
  --------------------------- */
  useEffect(() => {
    if (!loading && (!user || user.role !== "ADMIN")) {
      router.push("/account");
    }
  }, [user, loading, router]);

  /* --------------------------
     Load Orders
  --------------------------- */
  useEffect(() => {
    if (user?.role === "ADMIN") {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    const res = await fetch(
      "http://localhost:5000/api/orders",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    setOrders(data);
  };

  /* --------------------------
     Status Counters
  --------------------------- */
  const counters = useMemo(() => {
    return {
      PENDING: orders.filter(o => o.status === "PENDING").length,
      PAYMENT_PENDING_VERIFICATION: orders.filter(o => o.status === "PAYMENT_PENDING_VERIFICATION").length,
      CONFIRMED: orders.filter(o => o.status === "CONFIRMED").length,
      SHIPPED: orders.filter(o => o.status === "SHIPPED").length,
      DELIVERED: orders.filter(o => o.status === "DELIVERED").length,
      CANCELLED: orders.filter(o => o.status === "CANCELLED").length,
    };
  }, [orders]);

  /* --------------------------
     Status Badge UI
  --------------------------- */
  const getStatusBadge = (status) => {
    const styles = {
      PENDING: "bg-yellow-100 text-yellow-800",
      PAYMENT_PENDING_VERIFICATION:
        "bg-yellow-100 text-yellow-800",
      CONFIRMED: "bg-green-100 text-green-800",
      SHIPPED: "bg-blue-100 text-blue-800",
      DELIVERED: "bg-gray-200 text-gray-800",
      CANCELLED: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-3 py-1 text-xs rounded-full font-medium ${styles[status]}`}
      >
        {status.replaceAll("_", " ")}
      </span>
    );
  };

  /* --------------------------
     Filter Orders
  --------------------------- */
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch = order.id
        .toLowerCase()
        .includes(search.toLowerCase());

      if (statusFilter === "ALL") {
        return (
          matchesSearch && order.status !== "DELIVERED"
        );
      }

      return (
        matchesSearch && order.status === statusFilter
      );
    });
  }, [orders, search, statusFilter]);

  /* --------------------------
     Update Status
  --------------------------- */
  const updateStatus = async (orderId, status) => {
    await fetch(
      `http://localhost:5000/api/orders/${orderId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      }
    );

    loadOrders();
  };

  if (loading || !user) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">

      <button
        onClick={() => router.push("/account")}
        className="text-sm text-gray-500 hover:underline"
      >
        ← Back to Account
      </button>

      <h1 className="text-2xl font-semibold">
        Orders Dashboard
      </h1>

      {/* =========================
         STATUS COUNTERS
      ========================== */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Object.entries(counters).map(([key, value]) => (
          <div key={key} className="border rounded p-3 text-center">
            <p className="text-xs text-gray-500">
              {key.replaceAll("_", " ")}
            </p>
            <p className="text-lg font-semibold">{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="grid md:grid-cols-2 gap-4">
        <input
          placeholder="Search order by ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="ALL">All (Except Delivered)</option>
          <option value="PENDING">Pending</option>
          <option value="PAYMENT_PENDING_VERIFICATION">
            Payment Pending Verification
          </option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Orders */}
      <div className="space-y-6">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="border rounded p-6 space-y-4"
          >
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">
                  Order ID: {order.id}
                </p>
                <p className="text-sm text-gray-500">
                  {order.user?.name}
                </p>
              </div>

              {getStatusBadge(order.status)}
            </div>

            <p className="text-sm text-gray-500">
              {new Date(order.createdAt).toLocaleString()}
            </p>

            <div className="font-semibold">
              Total: ₹{order.total}
            </div>

            {/* ADDRESS SECTION */}
            {order.address && (
              <div className="bg-gray-50 p-4 rounded text-sm">
                <p className="font-medium">
                  Shipping Address:
                </p>
                <p>{order.address.fullName}</p>
                <p>{order.address.line1}</p>
                {order.address.line2 && (
                  <p>{order.address.line2}</p>
                )}
                <p>
                  {order.address.city},{" "}
                  {order.address.state}
                </p>
                <p>{order.address.postalCode}</p>
                <p>{order.address.country}</p>
                <p className="mt-1 font-medium">
                  📞 {order.address.phone}
                </p>
              </div>
            )}

            {/* Items */}
            <div className="border-t pt-3 space-y-2">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-sm"
                >
                  <span>
                    {item.product?.name} × {item.quantity}
                  </span>
                  <span>
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* STATUS ACTION BUTTONS */}

            {order.status === "PENDING" && (
              <div className="flex gap-4">
                <button
                  onClick={() =>
                    updateStatus(order.id, "CONFIRMED")
                  }
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Confirm Order
                </button>

                <button
                  onClick={() =>
                    updateStatus(order.id, "CANCELLED")
                  }
                  className="px-4 py-2 bg-red-600 text-white rounded"
                >
                  Cancel Order
                </button>
              </div>
            )}

            {order.status ===
              "PAYMENT_PENDING_VERIFICATION" && (
              <div className="flex gap-4">
                <button
                  onClick={() =>
                    updateStatus(order.id, "CONFIRMED")
                  }
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Verify & Confirm Payment
                </button>

                <button
                  onClick={() =>
                    updateStatus(order.id, "CANCELLED")
                  }
                  className="px-4 py-2 bg-red-600 text-white rounded"
                >
                  Cancel Order
                </button>
              </div>
            )}

            {order.status === "CONFIRMED" && (
              <button
                onClick={() =>
                  updateStatus(order.id, "SHIPPED")
                }
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Mark as Shipped
              </button>
            )}

            {order.status === "SHIPPED" && (
              <button
                onClick={() =>
                  updateStatus(order.id, "DELIVERED")
                }
                className="px-4 py-2 bg-gray-600 text-white rounded"
              >
                Mark as Delivered
              </button>
            )}
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <p className="text-gray-500">
            No matching orders found.
          </p>
        )}
      </div>
    </div>
  );
}
