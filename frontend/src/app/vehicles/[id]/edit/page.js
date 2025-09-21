"use client";

import { useState, useEffect, useContext } from "react";
import { useParams, useRouter } from "next/navigation";
import { AuthContext } from "../../../../context/AuthContext";
import axios from "../../../../lib/axios";

export default function EditVehiclePage() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();
  const { id } = useParams();

  const [vehicle, setVehicle] = useState(null);
  const [loadingVehicle, setLoadingVehicle] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Redirect guests
  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  // Fetch vehicle data
  useEffect(() => {
    if (!loading && user) fetchVehicle();
  }, [loading, user]);

  const fetchVehicle = async () => {
    try {
      setLoadingVehicle(true);
      const res = await axios.get(`/vehicles/${id}`);
      setVehicle(res.data);
    } catch (err) {
      console.error(err);
      router.replace("/dashboard"); // redirect if vehicle not found
    } finally {
      setLoadingVehicle(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await axios.put(`/vehicles/${id}`, {
        plate_number: vehicle.plate_number,
        brand: vehicle.brand,
        model: vehicle.model,
        total_distance: vehicle.total_distance || 0,
      });
      setSuccess("Vehicle updated successfully! Redirecting...");
      setTimeout(() => router.replace("/dashboard"), 1000); // short delay to show success
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to update vehicle");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user || loadingVehicle) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Vehicle #{id}</h1>

      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-500 mb-2">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          Plate Number
          <input
            type="text"
            value={vehicle.plate_number}
            onChange={(e) =>
              setVehicle({ ...vehicle, plate_number: e.target.value })
            }
            className="w-full border p-2 rounded mt-1"
            required
          />
        </label>

        <label className="block">
          Brand
          <input
            type="text"
            value={vehicle.brand}
            onChange={(e) =>
              setVehicle({ ...vehicle, brand: e.target.value })
            }
            className="w-full border p-2 rounded mt-1"
            required
          />
        </label>

        <label className="block">
          Model
          <input
            type="text"
            value={vehicle.model}
            onChange={(e) =>
              setVehicle({ ...vehicle, model: e.target.value })
            }
            className="w-full border p-2 rounded mt-1"
            required
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          {submitting ? "Updating..." : "Update Vehicle"}
        </button>
      </form>
    </div>
  );
}
