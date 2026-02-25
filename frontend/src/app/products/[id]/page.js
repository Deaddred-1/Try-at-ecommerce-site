import Link from "next/link";
import { fetchProductById } from "@/lib/api";
import AddToCartButton from "@/components/AddToCartButton";
import ProductInfoModals from "@/components/ProductInfoModals";
import WishlistButton from "@/components/WishlistButton";

export default async function ProductDetail({ params }) {
  const { id } = await params;

  const product = await fetchProductById(id);
  const API_BASE = "http://localhost:5000";

  const hasDiscount =
    product.discountedPrice &&
    product.discountedPrice < product.price;

  const finalPrice = hasDiscount
    ? product.discountedPrice
    : product.price;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">

      <Link
        href="/products"
        className="text-sm text-gray-500 hover:underline inline-block"
      >
        ← Back to Products
      </Link>

      <div className="grid md:grid-cols-2 gap-8">

        {/* IMAGE */}
        <div>
          <img
            src={
              product.images?.[0]?.imageUrl
                ? `${API_BASE}${product.images[0].imageUrl}`
                : "/placeholder.png"
            }
            className="w-full rounded-lg"
            alt={product.name}
          />
        </div>

        {/* INFO */}
        <div>
          <h1 className="text-2xl font-semibold">
            {product.name}
          </h1>

          {/* Premium Badge */}
          {product.isPremium && (
            <span className="inline-block mt-2 bg-black text-white text-xs px-3 py-1 rounded">
              Premium Collection
            </span>
          )}

          {/* Stock Badge */}
          {!product.inStock && (
            <span className="inline-block mt-2 ml-2 bg-red-500 text-white text-xs px-3 py-1 rounded">
              Out of Stock
            </span>
          )}

          <p className="text-gray-500 mt-3">
            {product.description}
          </p>

          {/* PRICING */}
          <div className="mt-4">
            {hasDiscount && (
              <p className="text-gray-400 line-through">
                ₹{product.price}
              </p>
            )}

            <p className="text-2xl font-bold">
              ₹{finalPrice}
            </p>

            {hasDiscount && (
              <p className="text-sm text-green-600">
                You save ₹
                {product.price - product.discountedPrice}
              </p>
            )}
          </div>

          {/* ACTIONS */}
          <div className="mt-6 flex gap-4 items-center">

            {product.inStock ? (
              <AddToCartButton product={product} />
            ) : (
              <button
                disabled
                className="px-6 py-2 bg-gray-400 text-white rounded cursor-not-allowed"
              >
                Out of Stock
              </button>
            )}

            <WishlistButton productId={product.id} />

          </div>

          <ProductInfoModals />
        </div>
      </div>
    </div>
  );
}
