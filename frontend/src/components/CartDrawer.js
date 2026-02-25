"use client";

import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export default function CartDrawer({ isOpen, onClose }) {
  const {
    cartItems,
    increaseQty,
    decreaseQty,
    removeFromCart,
  } = useCart();

  const router = useRouter();

  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shipping = 0;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    onClose();
    router.push("/checkout");
  };

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-40"
      />

      <div className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-50 shadow-lg flex flex-col">

        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <button onClick={onClose} className="text-xl">×</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {cartItems.length === 0 && (
            <p className="text-sm text-gray-500">
              Your cart is empty
            </p>
          )}

          {cartItems.map(item => {

            const image = item.image
              ? `http://localhost:5000${item.image}`
              : "/placeholder.png";

            return (
              <div key={item.id} className="flex gap-4 items-center">

                <img
                  src={image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />

                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="font-semibold">₹{item.price}</p>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() =>
                        decreaseQty(item.id, item.quantity)
                      }
                      className="border px-2 rounded"
                    >
                      −
                    </button>

                    <span className="text-sm">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        increaseQty(item.id, item.quantity)
                      }
                      className="border px-2 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-sm text-red-500"
                >
                  ✕
                </button>

              </div>
            );
          })}
        </div>

        <div className="border-t p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>₹{shipping}</span>
          </div>

          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={cartItems.length === 0}
            className="w-full mt-4 bg-black text-white py-3 rounded disabled:bg-gray-400"
          >
            Proceed to Checkout
          </button>
        </div>

      </div>
    </>
  );
}