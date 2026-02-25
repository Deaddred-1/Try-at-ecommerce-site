"use client";

import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider, useCart } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";

function LayoutContent({ children }) {
  const { isCartOpen, closeCart } = useCart();

  return (
    <>
      <Navbar />
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
      {children}
    </>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <LayoutContent>{children}</LayoutContent>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
