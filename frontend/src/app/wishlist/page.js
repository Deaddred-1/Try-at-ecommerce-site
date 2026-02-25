"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function WishlistPage() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { wishlist, removeFromWishlist } = useWishlist();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">

      {/* Back to Products */}
      <Link
        href="/products"
        className="text-sm text-gray-500 hover:underline inline-block"
      >
        ← Back to Products
      </Link>

      <h1 className="text-2xl font-semibold">My Wishlist</h1>

      {wishlist.length === 0 && (
        <p className="text-gray-500">
          No items in wishlist.
        </p>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {wishlist.map((item) => {
          const product = item.product;
          if (!product) return null;

          const image = product.images?.[0]?.imageUrl
            ? `http://localhost:5000${product.images[0].imageUrl}`
            : "/placeholder.png";

          const hasDiscount =
            product.discountedPrice &&
            product.discountedPrice < product.price;

          const finalPrice = hasDiscount
            ? product.discountedPrice
            : product.price;

          return (
            <div
              key={item.productId}
              className="border p-4 rounded space-y-3"
            >
              <div
                className="cursor-pointer"
                onClick={() =>
                  router.push(`/products/${item.productId}`)
                }
              >
                <img
                  src={image}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded"
                />

                <h3 className="font-semibold mt-2">
                  {product.name}
                </h3>

                <div>
                  {hasDiscount && (
                    <p className="text-sm text-gray-400 line-through">
                      ₹{product.price}
                    </p>
                  )}

                  <p className="font-semibold">
                    ₹{finalPrice}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => addToCart(product.id)}
                  className="flex-1 bg-black text-white py-2 rounded text-sm"
                >
                  Add to Cart
                </button>

                <button
                  onClick={() =>
                    removeFromWishlist(product.id)
                  }
                  className="px-3 py-2 border text-sm rounded"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}