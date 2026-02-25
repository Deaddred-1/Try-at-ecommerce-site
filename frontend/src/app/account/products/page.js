"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  fetchProducts,
  createProduct,
  updateProductApi,
} from "@/lib/api";

export default function AdminProductsPage() {
  const { user, loading, token } = useAuth();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [editingProductId, setEditingProductId] = useState(null);

  const emptyForm = {
    name: "",
    price: "",
    discountedPrice: "",
    category: "",
    baseColor: "",
    description: "",
    isPremium: false,
    inStock: true,
    images: [],
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!loading && (!user || user.role !== "ADMIN")) {
      router.push("/account");
    }
  }, [user, loading]);

  useEffect(() => {
    if (user?.role === "ADMIN") {
      loadProducts();
    }
  }, [user]);

  const loadProducts = async () => {
    const data = await fetchProducts();
    setProducts(data.data || []);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        discountedPrice: form.discountedPrice
          ? Number(form.discountedPrice)
          : null,
      };

      if (editingProductId) {
        await updateProductApi(token, editingProductId, payload);
      } else {
        await createProduct(token, payload);
      }

      setForm(emptyForm);
      setEditingProductId(null);
      loadProducts();
    } catch (err) {
      console.error(err);
      alert("Operation failed");
    }
  };

  const handleEdit = (product) => {
    setEditingProductId(product.id);

    setForm({
      name: product.name,
      price: product.price,
      discountedPrice: product.discountedPrice || "",
      category: product.category || "",
      baseColor: product.baseColor || "",
      description: product.description || "",
      isPremium: product.isPremium || false,
      inStock: product.inStock ?? true,
      images: [],
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleStock = async (product) => {
    await updateProductApi(token, product.id, {
      inStock: !product.inStock,
    });
    loadProducts();
  };

  if (loading || !user) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">

      <h1 className="text-2xl font-semibold">
        Product Management
      </h1>

      {/* FORM */}
      <div className="border rounded p-6 space-y-4">

        <div className="grid md:grid-cols-2 gap-4">

          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            className="border p-2 rounded"
          />

          <input
            placeholder="Price"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: e.target.value })
            }
            className="border p-2 rounded"
          />

          <input
            placeholder="Discounted Price"
            value={form.discountedPrice}
            onChange={(e) =>
              setForm({
                ...form,
                discountedPrice: e.target.value,
              })
            }
            className="border p-2 rounded"
          />

          <input
            placeholder="Category"
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
            className="border p-2 rounded"
          />

          <input
            placeholder="Base Color"
            value={form.baseColor}
            onChange={(e) =>
              setForm({ ...form, baseColor: e.target.value })
            }
            className="border p-2 rounded"
          />

          {/* FILE INPUT */}
          <input
            type="file"
            multiple
            onChange={(e) =>
              setForm({
                ...form,
                images: Array.from(e.target.files),
              })
            }
            className="border p-2 rounded"
          />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="border p-2 rounded md:col-span-2"
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isPremium}
              onChange={(e) =>
                setForm({
                  ...form,
                  isPremium: e.target.checked,
                })
              }
            />
            Premium
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.inStock}
              onChange={(e) =>
                setForm({
                  ...form,
                  inStock: e.target.checked,
                })
              }
            />
            In Stock
          </label>
        </div>

        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          {editingProductId ? "Update" : "Add Product"}
        </button>
      </div>

      {/* PRODUCT LIST */}
      <div className="grid md:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="border p-4 rounded space-y-2"
          >
            <img
              src={
                product.images?.[0]?.imageUrl
                  ? `http://localhost:5000${product.images[0].imageUrl}`
                  : "/placeholder.png"
              }
              className="w-full h-40 object-cover rounded"
            />

            <h3 className="font-semibold">
              {product.name}
            </h3>

            <p className="font-medium">
              ₹{product.discountedPrice ?? product.price}
            </p>

            {/* STOCK BADGE */}
            <span
              className={`inline-block text-xs px-2 py-1 rounded ${
                product.inStock
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {product.inStock ? "In Stock" : "Out of Stock"}
            </span>

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleEdit(product)}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Edit
              </button>

              <button
                onClick={() => toggleStock(product)}
                className={`px-3 py-1 rounded text-white ${
                  product.inStock
                    ? "bg-red-600"
                    : "bg-green-600"
                }`}
              >
                {product.inStock
                  ? "Mark Out of Stock"
                  : "Mark In Stock"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
