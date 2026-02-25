"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  fetchCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
} from "@/lib/api";
import { useRouter } from "next/navigation";

const CartContext = createContext();

export function CartProvider({ children }) {
  const router = useRouter();
  const { user, token } = useAuth();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  /* -------------------------
     Load cart from backend
  -------------------------- */
  const loadCart = async () => {
    if (!token) {
      setCartItems([]);
      return;
    }

    setLoading(true);
    try {
      const data = await fetchCart(token);
      setCartItems(data.items || []);
    } catch (err) {
      console.error("Failed to load cart", err);
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------
     Load cart on login/logout
  -------------------------- */
  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      setCartItems([]);
    }
  }, [user]);

  /* -------------------------
     Cart actions
  -------------------------- */
  const addToCart = async (productId) => {
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      await addCartItem(token, productId);
      await loadCart();
      openCart();
    } catch (err) {
      console.error("Failed to add to cart", err);
    }
  };

  const increaseQty = async (productId, currentQty) => {
    if (!token) return;

    try {
      await updateCartItem(token, productId, currentQty + 1);
      await loadCart();
    } catch (err) {
      console.error("Failed to increase quantity", err);
    }
  };

  const decreaseQty = async (productId, currentQty) => {
    if (!token) return;

    try {
      if (currentQty - 1 <= 0) {
        await removeCartItem(token, productId);
      } else {
        await updateCartItem(token, productId, currentQty - 1);
      }
      await loadCart();
    } catch (err) {
      console.error("Failed to decrease quantity", err);
    }
  };

  const removeFromCart = async (productId) => {
    if (!token) return;

    try {
      await removeCartItem(token, productId);
      await loadCart();
    } catch (err) {
      console.error("Failed to remove item", err);
    }
  };

  const cartCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        isCartOpen,
        openCart,
        closeCart,
        cartItems,
        cartCount,
        loading,
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
