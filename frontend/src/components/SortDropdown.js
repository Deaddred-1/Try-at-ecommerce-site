"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SortDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const applySort = (value) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value) params.delete("sort");
    else params.set("sort", value);

    router.push(`/products?${params.toString()}`);
  };

  return (
    <select
      onChange={e => applySort(e.target.value)}
      defaultValue={searchParams.get("sort") || ""}
      className="border rounded px-3 py-1 text-sm"
    >
      <option value="">Sort by</option>
      <option value="price_asc">Price: Low → High</option>
      <option value="price_desc">Price: High → Low</option>
      <option value="newest">Newest</option>
    </select>
  );
}