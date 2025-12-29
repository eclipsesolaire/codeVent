import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function MyTaxes() {
  const [taxData, setTaxData] = useState([
    { month: "September", history: [] },
    { month: "October", history: [] },
    { month: "November", history: [] },
    { month: "December", history: [] },
    { month: "January", history: [] },
    { month: "February", history: [] },
    { month: "March", history: [] },

  ]);

  const [month, setMonth] = useState("");
  const [tax, setTax] = useState("");

  const handleAdd = () => {
    if (!month.trim() || !tax.trim()) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    const taxValue = parseFloat(tax);
    if (isNaN(taxValue) || taxValue < 0) {
      alert("Veuillez entrer un montant valide");
      return;
    }

    setTaxData((prev) => {
      const monthIndex = prev.findIndex(
        (item) => item.month.toLowerCase() === month.toLowerCase()
      );

      if (monthIndex !== -1) {
        // Ajouter une entrée dans un mois existant
        return prev.map((item, index) =>
          index === monthIndex
            ? {
                ...item,
                history: [
                  ...item.history,
                  { id: Date.now(), tax: taxValue },
                ],
              }
            : item
        );
      } else {
        // Créer un nouveau mois
        return [
          ...prev,
          {
            month: month,
            history: [{ id: Date.now(), tax: taxValue }],
          },
        ];
      }
    });

    setMonth("");
    setTax("");
  };

  const handleRemoveEntry = (month, entryId) => {
    setTaxData((prev) =>
      prev.map((item) =>
        item.month === month
          ? {
              ...item,
              history: item.history.filter((entry) => entry.id !== entryId),
            }
          : item
      )
    );
  };

  const handleResetMonth = (month) => {
    if (window.confirm("Voulez-vous réinitialiser ce mois ?")) {
      setTaxData((prev) =>
        prev.map((item) =>
          item.month === month ? { ...item, history: [] } : item
        )
      );
    }
  };

  // total de tous les impôts (somme des historiques)
  const totalTax = taxData.reduce(
    (sum, item) => sum + item.history.reduce((s, h) => s + h.tax, 0),
    0
  );

  // Préparer les données du graphique
  const chartData = taxData.map((item) => ({
    month: item.month,
    tax: item.history.reduce((s, h) => s + h.tax, 0),
  }));

  return (
    <div className="w-[90%] max-w-6xl mx-auto mt-2 p-6 ml-[10%]">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Courbe des Impôts Reçus
      </h2>

      {/* Statistiques rapides */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-semibold text-blue-600">
              Total des impôts
            </p>
            <p className="text-2xl font-bold text-blue-800">
              {totalTax.toFixed(2)} €
            </p>
          </div>
          <div>
            <p className="text-lg font-semibold text-blue-600">Nombre de mois</p>
            <p className="text-2xl font-bold text-blue-800">{taxData.length}</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-blue-600">
              Moyenne mensuelle
            </p>
            <p className="text-2xl font-bold text-blue-800">
              {taxData.length > 0
                ? (totalTax / taxData.length).toFixed(2)
                : 0}{" "}
              €
            </p>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">
          Ajouter/Modifier des données
        </h3>
        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="text"
            placeholder="Mois (ex: Mars 2024)"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg w-[200px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="number"
            placeholder="Impôt (€)"
            value={tax}
            onChange={(e) => setTax(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg w-[150px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
            step="0.01"
          />
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Ajouter
          </button>
        </div>
      </div>

      {/* Graphique */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">
          Évolution des impôts
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              unit="€"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              formatter={(value) => [`${value}`, "Impôt reçu"]}
              labelStyle={{ color: "#333" }}
              contentStyle={{
                backgroundColor: "#f8f9fa",
                border: "1px solid #dee2e6",
              }}
            />
            <Line
              type="monotone"
              dataKey="tax"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: "#3b82f6", strokeWidth: 2 }}
              name="Impôt reçu"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Tableau */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">
          Données détaillées
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-3 text-left">Mois</th>
                <th className="border border-gray-300 p-3 text-right">
                  Impôt (€)
                </th>
                <th className="border border-gray-300 p-3 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {taxData.map((item) =>
                item.history.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-3">{item.month}</td>
                    <td className="border border-gray-300 p-3 text-right font-medium">
                      {entry.tax.toFixed(2)} €
                    </td>
                    <td className="border border-gray-300 p-3 text-center">
                      <button
                        onClick={() => handleRemoveEntry(item.month, entry.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 mr-2"
                      >
                        Supprimer
                      </button>
                      <button
                        onClick={() => handleResetMonth(item.month)}
                        className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
                      >
                        Vider mois
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
