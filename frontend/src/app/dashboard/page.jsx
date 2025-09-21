"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../../context/AuthContext";
import axios from "../../lib/axios";

export default function DashboardPage() {
  const { token, logout, loading } = useContext(AuthContext);
  const router = useRouter();

  const [vehicles, setVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(5);
  const [lastPage, setLastPage] = useState(1);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !token) router.replace("/login");
  }, [loading, token]);

  // Fetch vehicles from backend
  const fetchVehicles = async (page = 1) => {
    try {
      setLoadingVehicles(true);
      const res = await axios.get("/vehicles", {
        params: { page, per_page: perPage },
      });
      setVehicles(res.data.data || []);
      setCurrentPage(res.data.current_page || 1);
      setLastPage(res.data.last_page || 1);
    } catch (err) {
      console.error(err);
      setVehicles([]);
    } finally {
      setLoadingVehicles(false);
    }
  };

  useEffect(() => {
    if (token) fetchVehicles(currentPage);
  }, [token, currentPage]);

  if (loading || !token || loadingVehicles) return <p>Loading...</p>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex space-x-2">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => router.push("/vehicles")}
          >
            Manage Vehicles
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Plate Number</th>
            <th className="border p-2">Brand</th>
            <th className="border p-2">Model</th>
            <th className="border p-2">Created At</th>
            <th className="border p-2">Total Distance (km)</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((v) => (
            <tr key={v.id}>
              <td className="border p-2">{v.plate_number}</td>
              <td className="border p-2">{v.brand}</td>
              <td className="border p-2">{v.model}</td>
              <td className="border p-2">{new Date(v.created_at).toLocaleString()}</td>
              <td className="border p-2">{v.total_distance || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Backend Pagination */}
      {lastPage > 1 && (
        <div className="mt-4 flex space-x-2">
          {Array.from({ length: lastPage }, (_, i) => (
            <button
              key={i}
              onClick={() => fetchVehicles(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1 ? "bg-blue-500 text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
