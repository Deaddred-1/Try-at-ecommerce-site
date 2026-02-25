"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export default function Navbar() {
  const { openCart, cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const pathname = usePathname();
  const router = useRouter();

  const isHome = pathname === "/";
  const hideIcons = pathname.startsWith("/checkout") || pathname.startsWith("/order-success");

  return (
    <nav className="w-full border-b px-6 py-4 flex items-center justify-between">

      {/* LEFT */}
      <div className="flex gap-6 text-sm">
        <Link href="/about" className="hover:opacity-70">
          About
        </Link>
        <Link href="/contact" className="hover:opacity-70">
          Contact
        </Link>
        <Link href="/account" className="hover:opacity-70">
          Account
        </Link>
      </div>

      {/* CENTER LOGO */}
      {!isHome && (
        <Link
          href="/"
          className="text-xl font-semibold tracking-wide"
        >
          SYLERA
        </Link>
      )}

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-6">
        {!hideIcons && (
          <>
            {/* Wishlist */}
            <button
              onClick={() => router.push("/wishlist")}
              className="relative hover:opacity-70"
              title="Wishlist"
            >
              ♡
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full px-2">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Search */}
            <button
              title="Search"
              className="hover:opacity-70"
            >
              🔍
            </button>

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative hover:opacity-70"
              title="Cart"
            >
              🛒
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full px-2">
                  {cartCount}
                </span>
              )}
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
