"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function AddToCartButton({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={() => addToCart(product.id)}
        className="px-6 py-2 bg-black text-white rounded hover:opacity-90 transition"
      >
        Add to Cart
      </button>

      {!user && (
        <span className="text-xs text-gray-500 text-center">
          Login required
        </span>
      )}
    </div>
  );
}
