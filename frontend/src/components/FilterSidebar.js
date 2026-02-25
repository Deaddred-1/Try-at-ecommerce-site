"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

  const applyFilters = (extra = {}) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(extra).forEach(([key, value]) => {
      if (!value) params.delete(key);
      else params.set(key, value);
    });

    router.push(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("/products");
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <div className="w-64 hidden md:block border rounded p-4 space-y-6">
      <h3 className="font-semibold">Filters</h3>

      {/* Category */}
      <div>
        <p className="text-sm font-medium mb-2">Category</p>
        {["ring", "necklace", "earring"].map(cat => (
          <button
            key={cat}
            onClick={() => applyFilters({ category: cat })}
            className="block text-left text-sm capitalize hover:underline"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Base Color */}
      <div>
        <p className="text-sm font-medium mb-2">Base Color</p>
        {["gold", "silver", "rose-gold"].map(color => (
          <button
            key={color}
            onClick={() => applyFilters({ baseColor: color })}
            className="block text-left text-sm capitalize hover:underline"
          >
            {color.replace("-", " ")}
          </button>
        ))}
      </div>

      {/* Price */}
      <div>
        <p className="text-sm font-medium mb-2">Price</p>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
            className="w-full border rounded px-2 py-1 text-sm"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
            className="w-full border rounded px-2 py-1 text-sm"
          />
        </div>

        <button
          onClick={() => applyFilters({ minPrice, maxPrice })}
          className="mt-2 w-full bg-black text-white text-sm py-1 rounded"
        >
          Apply
        </button>
      </div>

      {/* In stock */}
      <button
        onClick={() => applyFilters({ inStock: "true" })}
        className="text-sm underline"
      >
        In stock only
      </button>

      {/* Premium only */}
      <button
        onClick={() => applyFilters({ isPremium: "true" })}
        className="text-sm underline"
      >
        Premium only
      </button>


      {/* Clear */}
      <button
        onClick={clearFilters}
        className="text-sm text-red-500 underline mt-4"
      >
        Clear all filters
      </button>
    </div>
  );
}
