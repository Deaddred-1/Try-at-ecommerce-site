"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function OrderSuccessPage() {
  const params = useSearchParams();
  const orderId = params.get("orderId");

  const { loadCart } = useCart(); // 👈 use existing function

  useEffect(() => {
    loadCart(); // 👈 re-sync cart with backend
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-10 text-center space-y-6">
      <h1 className="text-3xl font-semibold">
        Order Placed Successfully!
      </h1>

      <p>Your order ID:</p>

      <p className="font-mono text-lg">
        {orderId}
      </p>

      <Link
        href="/account"
        className="inline-block mt-4 px-6 py-3 bg-black text-white rounded"
      >
        View My Orders
      </Link>
    </div>
  );
}
