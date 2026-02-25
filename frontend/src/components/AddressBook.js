"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  fetchAddresses,
  addAddress,
  deleteAddress,
  setDefaultAddress,
} from "@/lib/address";

export default function AddressBook() {
  const { token } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    isDefault: false,
  });

  const loadAddresses = async () => {
    const data = await fetchAddresses(token);
    setAddresses(data);
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleAdd = async () => {
    await addAddress(token, form);
    setForm({
      fullName: "",
      phone: "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      isDefault: false,
    });
    setShowForm(false);
    loadAddresses();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold">Address Book</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm underline"
        >
          {showForm ? "Cancel" : "Add Address"}
        </button>
      </div>

      {showForm && (
        <div className="grid gap-2">
          {Object.keys(form).map(
            (key) =>
              key !== "isDefault" && (
                <input
                  key={key}
                  placeholder={key}
                  value={form[key]}
                  onChange={(e) =>
                    setForm({ ...form, [key]: e.target.value })
                  }
                  className="border p-2 rounded"
                />
              )
          )}

          <label className="text-sm">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) =>
                setForm({ ...form, isDefault: e.target.checked })
              }
            />{" "}
            Set as default
          </label>

          <button
            onClick={handleAdd}
            className="bg-black text-white py-2 rounded"
          >
            Save Address
          </button>
        </div>
      )}

      {addresses.map((addr) => (
        <div key={addr.id} className="border p-3 rounded space-y-1">
          <p className="font-medium">{addr.fullName}</p>
          <p>{addr.line1}</p>
          <p>{addr.city}, {addr.state} - {addr.postalCode}</p>
          <p>{addr.country}</p>
          <p className="text-sm">{addr.phone}</p>

          {addr.isDefault && (
            <span className="text-xs bg-black text-white px-2 py-1 rounded">
              Default
            </span>
          )}

          <div className="flex gap-4 text-sm mt-2">
            {!addr.isDefault && (
              <button
                onClick={() => {
                  setDefaultAddress(token, addr.id);
                  loadAddresses();
                }}
                className="underline"
              >
                Make Default
              </button>
            )}

            <button
              onClick={() => {
                deleteAddress(token, addr.id);
                loadAddresses();
              }}
              className="underline text-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
