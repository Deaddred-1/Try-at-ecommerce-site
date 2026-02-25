import Link from "next/link";

const API_BASE = "http://localhost:5000";

export default function ProductCard({ product }) {
  const image =
    product.images?.[0]?.imageUrl
      ? `${API_BASE}${product.images[0].imageUrl}`
      : "/placeholder.png";

  const hasDiscount =
    product.discountedPrice &&
    product.discountedPrice < product.price;

  const finalPrice = hasDiscount
    ? product.discountedPrice
    : product.price;

  return (
    <Link href={`/products/${product.id}`}>
      <div className="relative border rounded-lg p-3 hover:shadow-md transition">

        {product.isPremium && (
          <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
            Premium
          </span>
        )}

        <img
          src={image}
          alt={product.name}
          className="w-full h-48 object-cover rounded"
        />

        <h3 className="mt-2 font-medium">
          {product.name}
        </h3>

        <p className="text-sm text-gray-500 capitalize">
          {product.baseColor}
        </p>

        <div className="mt-1">
          {hasDiscount && (
            <p className="text-sm text-gray-400 line-through">
              ₹{product.price}
            </p>
          )}

          <p className="font-semibold text-lg">
            ₹{finalPrice}
          </p>

          {hasDiscount && (
            <p className="text-xs text-green-600">
              Save ₹{product.price - product.discountedPrice}
            </p>
          )}
        </div>

        {!product.inStock && (
          <p className="text-xs text-red-600 mt-1 font-medium">
            Out of Stock
          </p>
        )}

      </div>
    </Link>
  );
}
