const BASE = "http://localhost:5000/api/cart";

export async function fetchCart(token) {
  const res = await fetch(BASE, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch cart");
  return res.json();
}

export async function addToCartApi(token, productId) {
  const res = await fetch(`${BASE}/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId }),
  });

  if (!res.ok) throw new Error("Failed to add to cart");
}