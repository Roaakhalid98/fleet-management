"use client";

import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../../../context/AuthContext";
import axios from "../../../lib/axios";

export default function CreateVehiclePage() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  const [plateNumber, setPlateNumber] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [totalDistance, setTotalDistance] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Redirect guests to login
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await axios.post("/vehicles", {
        plate_number: plateNumber,
        brand,
        model,
        total_distance: totalDistance || 0,
      });
      router.replace("/dashboard"); // go back to dashboard after creation
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create vehicle");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user) return <p>Redirecting...</p>;

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Vehicle</h1>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          Plate Number
          <input
            type="text"
            value={plateNumber}
            onChange={(e) => setPlateNumber(e.target.value)}
            className="w-full border p-2 rounded mt-1"
            required
          />
        </label>

        <label className="block">
          Brand
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full border p-2 rounded mt-1"
            required
          />
        </label>

        <label className="block">
          Model
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full border p-2 rounded mt-1"
            required
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-green-500 text-white p-2 rounded"
        >
          {submitting ? "Saving..." : "Create Vehicle"}
        </button>
      </form>
    </div>
  );
}
