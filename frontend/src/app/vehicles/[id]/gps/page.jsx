"use client";

import { useState, useContext, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AuthContext } from "../../../../context/AuthContext";
import axios from "../../../../lib/axios";

export default function VehicleGpsPage() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();
  const { id } = useParams(); // vehicle ID from URL

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await axios.post(`/vehicles/${id}/locations`, {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      });

      setSuccess("GPS location submitted successfully!");
      setLatitude("");
      setLongitude("");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to submit GPS location");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Submit GPS Location for Vehicle #{id}</h1>

      {success && <p className="text-green-500 mb-2">{success}</p>}
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          step="any"
          placeholder="Latitude"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="number"
          step="any"
          placeholder="Longitude"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          {submitting ? "Submitting..." : "Submit GPS Location"}
        </button>
      </form>

      <div className="mt-4">
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          onClick={() => router.push("/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
