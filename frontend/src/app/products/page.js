import { fetchProducts } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import FilterSidebar from "@/components/FilterSidebar";
import SortDropdown from "@/components/SortDropdown";

export default async function ProductsPage({ searchParams }) {
  const params = await searchParams;
  const products = await fetchProducts(params);

  return (
    <div className="p-6 space-y-4">
      {/* Top bar */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Products</h1>
        <SortDropdown />
      </div>

      <div className="flex gap-6">
        <FilterSidebar />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 flex-1">
          {products.data.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

