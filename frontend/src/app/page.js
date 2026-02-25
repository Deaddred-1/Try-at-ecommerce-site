import { fetchProducts } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export default async function HomePage() {
  const products = await fetchProducts({
    isPremium: "true",
    limit: 8,
  });

  return (
    <div className="px-6 py-10 space-y-12">
      
      {/* Hero */}
      <section className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-wide">
          SYLERA
        </h1>
        <p className="text-gray-500">
          Handcrafted jewellery for everyday elegance
        </p>

        <Link
          href="/products"
          className="inline-block mt-4 px-6 py-3 bg-black text-white rounded"
        >
          Shop All
        </Link>
      </section>

      {/* Featured Products */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold">
          Premium Collection
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.data.map(product => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
