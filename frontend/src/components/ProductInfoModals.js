"use client";

import { useState } from "react";

export default function ProductInfoModals() {
  const [openModal, setOpenModal] = useState(null);

  const closeModal = () => setOpenModal(null);

  return (
    <>
      {/* Buttons */}
      <div className="mt-6 space-y-3 text-sm">
        <button
          onClick={() => setOpenModal("size")}
          className="underline text-gray-700 hover:text-black"
        >
          Size Chart
        </button>

        <button
          onClick={() => setOpenModal("delivery")}
          className="underline text-gray-700 hover:text-black"
        >
          Delivery Information
        </button>

        <button
          onClick={() => setOpenModal("returns")}
          className="underline text-gray-700 hover:text-black"
        >
          Returns & Exchange
        </button>
      </div>

      {/* Overlay */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-lg shadow-lg p-6 relative">

            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-xl"
            >
              ×
            </button>

            {/* SIZE GUIDE */}
            {openModal === "size" && (
              <div className="space-y-3 text-sm">
                <h2 className="text-lg font-semibold">Size Guide</h2>

                <p><strong>Earrings:</strong> All earrings are One Size (fits all).</p>
                <p><strong>Rings:</strong> All rings are either Adjustable or One Size. Adjustable rings can be resized with slight pressure.</p>
                <p><strong>Neckpieces:</strong> All neckpieces have an Adjustable chain for suitable fit.</p>
                <p><strong>Bracelets & Bangles:</strong> Free Size and Adjustable.</p>
                <p><strong>Anklets:</strong> Adjustable chain for suitable fit.</p>
                <p><strong>Hair Accessories:</strong> One Size (fits all).</p>
              </div>
            )}

            {/* DELIVERY */}
            {openModal === "delivery" && (
              <div className="space-y-3 text-sm">
                <h2 className="text-lg font-semibold">Delivery Information</h2>
                <p>Orders are processed within 1–2 business days.</p>
                <p>Delivery usually takes 3–7 working days depending on your location.</p>
                <p>You will receive tracking details once your order is shipped.</p>
              </div>
            )}

            {/* RETURNS */}
            {openModal === "returns" && (
              <div className="space-y-3 text-sm">
                <h2 className="text-lg font-semibold">Returns & Exchange</h2>
                <p>We accept returns within 7 days of delivery.</p>
                <p>Items must be unused and in original condition.</p>
                <p>For return requests, contact our support with your order ID.</p>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}
