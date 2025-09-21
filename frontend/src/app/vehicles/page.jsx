"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../../context/AuthContext";
import axios from "../../lib/axios";

export default function VehicleManagementPage() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  const [vehicles, setVehicles] = useState([]);
  const [fetching, setFetching] = useState(true);

  const [editingVehicle, setEditingVehicle] = useState(null);
  const [formData, setFormData] = useState({
    plate_number: "",
    brand: "",
    model: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  // Fetch vehicles
  const fetchVehicles = async () => {
    setFetching(true);
    try {
      const res = await axios.get("/vehicles");
      setVehicles(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (!loading && user) fetchVehicles();
  }, [loading, user]);

  // Handle form submit (create/update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      if (editingVehicle) {
        await axios.put(`/vehicles/${editingVehicle.id}`, formData);
      } else {
        await axios.post("/vehicles", formData);
      }
      setFormData({ plate_number: "", brand: "", model: "" });
      setEditingVehicle(null);
      fetchVehicles();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save vehicle");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle edit click
  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      plate_number: vehicle.plate_number,
      brand: vehicle.brand,
      model: vehicle.model,
    });
  };

  // Handle delete
  const handleDelete = async (vehicleId) => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return;
    try {
      await axios.delete(`/vehicles/${vehicleId}`);
      setVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
    } catch (err) {
      alert("Delete failed");
    }
  };

  if (loading || !user || fetching) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Vehicle Management</h1>
        <div className="flex space-x-2">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            onClick={() => router.push("/dashboard")}
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Vehicle Form */}
      <div className="mb-6 p-4 border rounded shadow">
        <h2 className="text-xl font-semibold mb-4">
          {editingVehicle ? "Edit Vehicle" : "Add Vehicle"}
        </h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Plate Number"
            value={formData.plate_number}
            onChange={(e) =>
              setFormData({ ...formData, plate_number: e.target.value })
            }
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Brand"
            value={formData.brand}
            onChange={(e) =>
              setFormData({ ...formData, brand: e.target.value })
            }
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Model"
            value={formData.model}
            onChange={(e) =>
              setFormData({ ...formData, model: e.target.value })
            }
            className="w-full border p-2 rounded"
            required
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            {submitting
              ? "Saving..."
              : editingVehicle
              ? "Update Vehicle"
              : "Add Vehicle"}
          </button>
        </form>
      </div>

      {/* Vehicles Table */}
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Plate</th>
            <th className="p-2 border">Brand</th>
            <th className="p-2 border">Model</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.length === 0 && (
            <tr>
              <td colSpan="4" className="p-2 text-center">
                No vehicles found.
              </td>
            </tr>
          )}
          {vehicles.map((v) => (
            <tr key={v.id}>
              <td className="p-2 border">{v.plate_number}</td>
              <td className="p-2 border">{v.brand}</td>
              <td className="p-2 border">{v.model}</td>
              <td className="p-2 border flex space-x-2">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                  onClick={() => handleEdit(v)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(v.id)}
                >
                  Delete
                </button>
                <button
                  className="bg-purple-500 text-white px-2 py-1 rounded"
                  onClick={() => router.push(`/vehicles/${v.id}/gps`)}
                >
                  Submit GPS
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
