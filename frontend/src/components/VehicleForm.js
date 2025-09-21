"use client";

import { useState } from "react";

export default function VehicleForm({ initialData = {}, onSubmit }) {
  const [plate_number, setPlateNumber] = useState(initialData.plate_number || "");
  const [brand, setBrand] = useState(initialData.brand || "");
  const [model, setModel] = useState(initialData.model || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ plate_number, brand, model });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
      <input
        type="text"
        placeholder="Plate Number"
        value={plate_number}
        onChange={(e) => setPlateNumber(e.target.value)}
        className="p-2 border rounded"
        required
      />
      <input
        type="text"
        placeholder="Brand"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
        className="p-2 border rounded"
        required
      />
      <input
        type="text"
        placeholder="Model"
        value={model}
        onChange={(e) => setModel(e.target.value)}
        className="p-2 border rounded"
        required
      />
      <button type="submit" className="bg-green-500 text-white p-2 rounded">
        Save
      </button>
    </form>
  );
}
