"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  fetchWishlist,
  addToWishlistApi,
  removeFromWishlistApi,
} from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { token } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (token) loadWishlist();
    else setWishlist([]);
  }, [token]);

  const loadWishlist = async () => {
    const data = await fetchWishlist(token);
    if (Array.isArray(data)) {
      setWishlist(data);
    }
  };

  const addToWishlist = async (productId) => {
    await addToWishlistApi(token, productId);
    await loadWishlist(); // 👈 re-fetch full data
  };

  const removeFromWishlist = async (productId) => {
    await removeFromWishlistApi(token, productId);
    await loadWishlist(); // 👈 re-fetch full data
  };

  const isWishlisted = (productId) =>
    wishlist.some((item) => item.productId === productId);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        addToWishlist,
        removeFromWishlist,
        isWishlisted,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
