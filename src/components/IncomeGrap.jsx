import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function IncomeGrap() {
  const [revenues, setRevenues] = useState([
    { month: "August", revenue: 0, history: [] },
    { month: "September", revenue: 0, history: [] },
    { month: "October", revenue: 0, history: [] },
    { month: "November", revenue: 0, history: [] },
    { month: "December", revenue: 0, history: [] },
    { month: "January", revenue: 0, history: [] },
    { month: "February", revenue: 0, history: [] },
  ]);

  const [selectedMonth, setSelectedMonth] = useState("");
  const [revenue, setRevenue] = useState("");
  const [fadeIn, setFadeIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = "https://ton-nom-de-projet.onrender.com/grossincome"

  useEffect(() => {
    setFadeIn(true);
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        console.log('Données reçues:', data);

        // Grouper par mois (soit via item.month, soit via createdAt)
        const monthlyData = {};
        data.forEach(item => {
          let month = item.month || new Date(item.createdAt).toLocaleString('en-FR', { month: 'long' });
          
          if (!monthlyData[month]) {
            monthlyData[month] = { total: 0, history: [] };
          }
          monthlyData[month].total += item.amount || 0;
          monthlyData[month].history.push(item.amount || 0);
        });

        console.log('Données groupées par mois:', monthlyData);

        // Mettre à jour les revenus
        const updatedRevenues = revenues.map((entry) => {
          const serverData = monthlyData[entry.month];
          return serverData
            ? {
                ...entry,
                revenue: serverData.total,
                history: serverData.history,
              }
            : entry;
        });
        setRevenues(updatedRevenues);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatMonth = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const handleSelectChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleSave = async () => {
    const formattedMonth = formatMonth(selectedMonth);
    const revenueValue = parseFloat(revenue);

    if (!formattedMonth || isNaN(revenueValue) || revenueValue <= 0) return;

    setIsLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `Revenu ${formattedMonth}`,
          amount: revenueValue,
          category: 'income',
          month: formattedMonth 
        }),
      });

      if (response.ok) {
        await loadData();
      } else {
        console.error('Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsLoading(false);
    }

    setRevenue("");
  };

  const removeLastRevenue = async () => {
    if (!selectedMonth) return;

    const formattedMonth = formatMonth(selectedMonth);
    setIsLoading(true);
    
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        const monthRevenues = data.filter(item => {
          const month = item.month || new Date(item.createdAt).toLocaleString('en-FR', { month: 'long' });
          return month === formattedMonth;
        });
        
        if (monthRevenues.length > 0) {
          const lastRevenue = monthRevenues[monthRevenues.length - 1];
          const deleteResponse = await fetch(`${API_URL}/${lastRevenue._id}`, {
            method: 'DELETE',
          });
          
          if (deleteResponse.ok) {
            await loadData();
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetMonth = async () => {
    if (!selectedMonth) return;

    const formattedMonth = formatMonth(selectedMonth);
    setIsLoading(true);
    
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        const monthRevenues = data.filter(item => {
          const month = item.month || new Date(item.createdAt).toLocaleString('en-FR', { month: 'long' });
          return month === formattedMonth;
        });
        
        for (const rev of monthRevenues) {
          await fetch(`${API_URL}/${rev._id}`, {
            method: 'DELETE',
          });
        }
        
        await loadData();
      }
    } catch (error) {
      console.error('Erreur lors du reset:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedMonthData = revenues.find(
    (entry) => entry.month.toLowerCase() === selectedMonth.toLowerCase()
  );

  return (
    <div className={`page-transition ${fadeIn ? "fade-in" : ""} ml-[2%]`}>
      <div style={{ width: "86%", margin: "auto", marginTop: "2rem", marginLeft: "10%" }}>
        <h2 className="text-[1.8rem] font-bold mb-[40px] text-center text-gray-500">
          📊 Graphique de Revenus Mensuels {isLoading && "⏳"}
        </h2>

        <div style={{ marginBottom: "30px" }}>
          <select
            value={selectedMonth}
            onChange={handleSelectChange}
            style={{
              padding: "8px",
              marginRight: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          >
            <option value="">Sélectionner un mois</option>
            {revenues.map((entry) => (
              <option key={entry.month} value={entry.month}>
                {entry.month}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Montant à ajouter (€)"
            value={revenue}
            onChange={(e) => setRevenue(e.target.value)}
            style={{
              padding: "8px",
              marginRight: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />

          {selectedMonth && (
            <div className="mt-4">
              <div className="flex gap-[2%] mb-4">
                <button
                  onClick={handleSave}
                  disabled={!revenue || parseFloat(revenue) <= 0 || isLoading}
                  style={{
                    padding: "8px 16px",
                    background: (!revenue || parseFloat(revenue) <= 0 || isLoading) ? "#ccc" : "#4CAF50",
                    color: "white",
                    borderRadius: "4px",
                    cursor: (!revenue || parseFloat(revenue) <= 0 || isLoading) ? "not-allowed" : "pointer"
                  }}
                >
                  {isLoading ? "⏳" : "Ajouter"}
                </button>

                <button
                  onClick={removeLastRevenue}
                  disabled={!selectedMonthData?.history.length || isLoading}
                  className={`px-4 py-2 rounded text-white font-medium ${
                    selectedMonthData?.history.length && !isLoading
                      ? "bg-red-500 hover:opacity-80 cursor-pointer" 
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {isLoading ? "⏳" : `Supprimer le dernier (${selectedMonthData?.history.length > 0 ? selectedMonthData.history[selectedMonthData.history.length - 1] : 0}€)`}
                </button>

                <button
                  onClick={resetMonth}
                  disabled={!selectedMonthData?.revenue || isLoading}
                  className={`px-4 py-2 rounded text-white font-medium ${
                    selectedMonthData?.revenue && !isLoading
                      ? "bg-orange-500 hover:opacity-80 cursor-pointer" 
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {isLoading ? "⏳" : "Reset mois"}
                </button>
              </div>

              {selectedMonthData && (
                <div className="bg-gray-100 p-4 rounded mb-4">
                  <h3 className="font-bold text-lg mb-2">{selectedMonth}</h3>
                  <p className="text-green-600 font-semibold">Total: {selectedMonthData.revenue}€</p>
                  {selectedMonthData.history.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 mb-1">Historique des ajouts:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedMonthData.history.map((amount, index) => (
                          <span key={index} className="bg-blue-200 px-2 py-1 rounded text-sm">
                            +{amount}€
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <ResponsiveContainer className="mt-[60px]" width="100%" height={300}>
          <BarChart data={revenues}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis unit="€" />
            <Tooltip 
              formatter={(value) => [`${value}€`, 'Revenue']}
              labelFormatter={(label) => `Mois: ${label}`}
            />
            <Bar dataKey="revenue" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
