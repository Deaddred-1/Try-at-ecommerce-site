const BASE = "http://localhost:5000/api/addresses";

export async function fetchAddresses(token) {
  const res = await fetch(BASE, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

export async function addAddress(token, payload) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function deleteAddress(token, id) {
  await fetch(`${BASE}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function setDefaultAddress(token, id) {
  await fetch(`${BASE}/${id}/default`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}