// src/components/MySpend.jsx
import React, { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

export default function MySpend() {
  const [data, setData] = useState([
    { month: "Jun 2025", won: 100, lost: 20 },
    { month: "Jul 2025", won: 200, lost: 50 },
    { month: "Aug 2025", won: 0, lost: 0 },
    { month: "Sep 2025", won: 0, lost: 0 },
    { month: "Oct 2025", won: 0, lost: 0 },
    { month: "Nov 2025", won: 0, lost: 0 },
    { month: "Dec 2025", won: 0, lost: 0 },
  ]);

  const [month, setMonth] = useState("");
  const [won, setWon] = useState("");
  const [lost, setLost] = useState("");

  const handleAdd = () => {
    if (month && !isNaN(won) && !isNaN(lost)) {
      setData(prev => [...prev, {
        month,
        won: parseFloat(won),
        lost: parseFloat(lost),
      }]);
      setMonth("");
      setWon("");
      setLost("");
    }
  };

  return (
    <div className="w-[85%] ml-[10%] mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">📊 Deals: Gagnés vs Perdus</h2>

      {/* Formulaire d'ajout */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Mois (ex: Sep 2023)"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border p-2 rounded w-[180px]"
        />
        <input
          type="number"
          placeholder="Won (ex: 100)"
          value={won}
          onChange={(e) => setWon(e.target.value)}
          className="border p-2 rounded w-[100px]"
        />
        <input
          type="number"
          placeholder="Lost (ex: 50)"
          value={lost}
          onChange={(e) => setLost(e.target.value)}
          className="border p-2 rounded w-[100px]"
        />
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Ajouter
        </button>
      </div>

      {/* Graphique */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis unit="k" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="won" stroke="#82ca9d" name="Gagné" />
          <Line type="monotone" dataKey="lost" stroke="#ff6b6b" name="Perdu" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
