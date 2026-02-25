const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/api`;;

export async function fetchProducts(params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([_, v]) => v !== undefined)
  ).toString();

  const res = await fetch(`${API_BASE}/products?${query}`, {
    cache: "no-store"
  });

  return res.json();
}

export async function fetchProductById(id) {
  const res = await fetch(
    `http://localhost:5000/api/products/${id}`,
    { cache: "no-store" }
  );

  console.log("STATUS:", res.status);

  if (!res.ok) {
    const text = await res.text();
    console.log("ERROR BODY:", text);
    throw new Error("Failed to fetch product");
  }

  return res.json();
}

export async function addToCart(productId) {
  const res = await fetch(`${API_BASE}/cart/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId })
  });

  if (!res.ok) {
    throw new Error("Failed to add to cart");
  }

  return res.json();
}

// CART APIs

export async function fetchCart(token) {
  const res = await fetch("http://localhost:5000/api/cart", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

export async function addCartItem(token, productId) {
  await fetch("http://localhost:5000/api/cart/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId }),
  });
}

export async function updateCartItem(token, productId, quantity) {
  await fetch("http://localhost:5000/api/cart/update", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId, quantity }),
  });
}

export async function removeCartItem(token, productId) {
  await fetch(`http://localhost:5000/api/cart/${productId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function createProduct(token, data) {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (key === "images") {
      value.forEach((file) =>
        formData.append("images", file)
      );
    } else {
      formData.append(key, value);
    }
  });

  const res = await fetch(`${API_BASE}/products`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) throw new Error("Failed");

  return res.json();
}

export async function deleteProductApi(token, id) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete product");
  }

  return res.json();
}

export async function updateProductApi(token, id, data) {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (key === "images" && value && value.length > 0) {
      value.forEach((file) => {
        formData.append("images", file);
      });
    } else {
      formData.append(key, value);
    }
  });

  const res = await fetch(
    `http://localhost:5000/api/products/${id}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (!res.ok) {
    throw new Error("Failed to update product");
  }

  return res.json();
}

export async function fetchWishlist(token) {
  const res = await fetch("http://localhost:5000/api/wishlist", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

export async function addToWishlistApi(token, productId) {
  await fetch("http://localhost:5000/api/wishlist", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId }),
  });
}

export async function removeFromWishlistApi(token, productId) {
  await fetch(
    `http://localhost:5000/api/wishlist/${productId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}
