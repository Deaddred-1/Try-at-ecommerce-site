"use client";

import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";

export default function WishlistButton({ productId }) {
  const { user } = useAuth();
  const {
    addToWishlist,
    removeFromWishlist,
    isWishlisted,
  } = useWishlist();

  const wishlisted = isWishlisted(productId);

  const toggleWishlist = () => {
    if (!user) {
      alert("Login required");
      return;
    }

    if (wishlisted) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  return (
    <button
      onClick={toggleWishlist}
      className="px-4 py-2 border rounded hover:bg-gray-50 transition"
    >
      {wishlisted ? "❤️ Wishlisted" : "♡ Add to Wishlist"}
    </button>
  );
}
