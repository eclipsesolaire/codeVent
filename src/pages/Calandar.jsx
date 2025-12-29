import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Calendar() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [events, setEvents] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = "http://localhost:3000/lettres";

  const allMonths = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];

  useEffect(() => {
    document.body.style.overflowY = "hidden";
    return () => (document.body.style.overflowY = "auto");
  }, []);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("🔄 Récupération des événements...");
      
      const response = await axios.get(API_URL);
      console.log("✅ Réponse serveur:", response.data);
      
      const serverEvents = response.data;
      const organized = {};

      serverEvents.forEach((event) => {
        const date = new Date(event.createdAt);
        const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        console.log(`📅 Événement "${event.title}" pour la date: ${dateKey}`);
        
        if (!organized[dateKey]) organized[dateKey] = [];
        organized[dateKey].push({
          id: event._id,
          title: event.title,
          createdAt: event.createdAt,
        });
      });

      console.log("📊 Événements organisés:", organized);
      setEvents(organized);
    } catch (error) {
      console.error("❌ Erreur récupération événements:", error);
      setError(`Erreur de récupération: ${error.message}`);
      
      // Si le serveur n'est pas accessible, on peut initialiser un state vide
      setEvents({});
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (title) => {
    if (selectedDay === null) {
      setError("Veuillez sélectionner un jour");
      return;
    }
    
    if (!title.trim()) {
      setError("Le titre de l'événement ne peut pas être vide");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      // Créer la date en s'assurant qu'elle est correcte
      const date = new Date(selectedYear, selectedMonth, selectedDay);
      console.log("📅 Création événement:", {
        title: title.trim(),
        date: date.toISOString(),
        selectedDay,
        selectedMonth,
        selectedYear
      });

      const response = await axios.post(API_URL, {
        title: title.trim(),
        createdAt: date.toISOString(),
      });

      console.log("✅ Événement créé:", response.data);
      
      // Récupérer les événements mis à jour
      await fetchEvents();
      
      // Réinitialiser le formulaire
      setInputValue("");
      setShowInput(false);
      
    } catch (error) {
      console.error("❌ Erreur création événement:", error);
      if (error.response) {
        setError(`Erreur serveur: ${error.response.data.error || error.response.statusText}`);
      } else if (error.request) {
        setError("Impossible de contacter le serveur. Vérifiez que le serveur est démarré.");
      } else {
        setError(`Erreur: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      setLoading(true);
      setError("");
      
      console.log("🗑️ Suppression événement:", eventId);
      await axios.delete(`${API_URL}/${eventId}`);
      
      // Récupérer les événements mis à jour
      await fetchEvents();
    } catch (error) {
      console.error("❌ Erreur suppression événement:", error);
      setError(`Erreur de suppression: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const daysCount = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();
    const start = firstDay === 0 ? 6 : firstDay - 1;

    const arr = [
      ...Array(start).fill(null),
      ...Array(daysCount).fill().map((_, i) => i + 1),
    ];
    while (arr.length % 7 !== 0) arr.push(null);
    setDaysInMonth(arr);
  }, [selectedMonth, selectedYear]);

  const handleMonthChange = (e) => {
    const idx = allMonths.findIndex((m) => m.toLowerCase() === e.target.value);
    setSelectedMonth(idx);
  };

  const handlePreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((y) => y - 1);
    } else setSelectedMonth((m) => m - 1);
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear((y) => y + 1);
    } else setSelectedMonth((m) => m + 1);
  };

  const handleDayClick = (day) => {
    if (day !== null) {
      setSelectedDay(day);
      setShowInput(false);
      setError("");
      console.log("📅 Jour sélectionné:", day);
    }
  };

  const handleCreateEvent = () => {
    if (selectedDay === null) {
      setError("Veuillez d'abord sélectionner un jour");
      return;
    }
    setShowInput(true);
    setError("");
  };

  const handleAddEvent = async () => {
    if (inputValue.trim() && selectedDay !== null) {
      await createEvent(inputValue.trim());
    } else {
      setError("Veuillez entrer un titre d'événement et sélectionner un jour");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddEvent();
    }
  };

  const getEventsForDay = (day) => {
    if (day === null) return [];
    const dateKey = `${selectedYear}-${selectedMonth}-${day}`;
    return events[dateKey] || [];
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="ml-[14%] w-[15%] h-screen border-r-2 border-gray-400 pr-4 p-2">
        <h2 className="font-bold text-gray-600 text-[1.6rem] -ml-[30%]">Calendar</h2>
        
        {/* Affichage des erreurs */}
        {error && (
          <div className="mb-4 -ml-[30%] w-[120%] bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
            {error}
          </div>
        )}
        
        <button
          onClick={handleCreateEvent}
          className="mb-4 -ml-[30%] mt-[30px] w-[120%] hover:opacity-60 bg-blue-500 text-white px-2 py-1 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Chargement..." : "Create event"}
        </button>

        {selectedDay && (
          <div className="mb-2 -ml-[30%] text-sm text-gray-600">
            Jour sélectionné: {selectedDay}
          </div>
        )}

        {showInput && (
          <div className="mb-4 -ml-[30%] w-[120%]">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nom de l'événement..."
              className="w-full p-2 border border-gray-300 rounded mb-2"
              autoFocus
              disabled={loading}
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddEvent}
                className="flex-1 bg-blue-500 hover:opacity-60 text-white px-2 py-1 rounded text-sm disabled:opacity-50"
                disabled={loading || !inputValue.trim()}
              >
                {loading ? "Ajout..." : "Ajouter"}
              </button>
              <button
                onClick={() => {
                  setShowInput(false);
                  setInputValue("");
                  setError("");
                }}
                className="px-2 py-1 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded text-sm"
                disabled={loading}
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        {/* Mois et navigation */}
        <div className="border-t-2 pt-2 mt-8 -ml-[35%] flex items-center justify-between">
          <h3 className="font-bold text-[0.9rem]">
            {allMonths[selectedMonth]} {selectedYear}
          </h3>
          <div className="flex gap-4">
            <button onClick={handlePreviousMonth}>
              <span className="material-symbols-outlined hover:opacity-50">chevron_left</span>
            </button>
            <button onClick={handleNextMonth}>
              <span className="material-symbols-outlined hover:opacity-50">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Grille jour */}
        <div className="flex flex-wrap gap-2 -ml-[40%] mt-4">
          {daysInMonth.map((day, id) => (
            <div
              key={id}
              onClick={() => handleDayClick(day)}
              className={`w-6 h-6 text-sm flex items-center justify-center rounded-full ${
                day
                  ? `text-gray-700 hover:bg-gray-400 hover:text-white cursor-pointer ${
                      selectedDay === day ? "bg-blue-500 text-white" : ""
                    }`
                  : "text-transparent cursor-default"
              }`}
            >
              {day}
            </div>
          ))}
        </div>
        
        <div className="mt-8 w-full ">
          <Link
            to="/calandarDay"
            className="block text-center -ml-[40%] bg-gray-200 text-gray-700 hover:text-green-600 py-2 px-4 rounded shadow transition duration-200"
          >
            Pass mode day
          </Link>
        </div>
      </div>

      {/* Main */}
      <div className="flex flex-col w-full pr-[5%]">
        <div className="pl-4 flex items-center mt-[10px] w-full h-[40px] border-b-2 border-gray-400">
          <p className="font-bold text-[1.3rem] text-blue-700">Date</p>
          <div className="ml-[7%] flex gap-8 items-center">
            <button onClick={handlePreviousMonth}>
              <span className="material-symbols-outlined hover:opacity-50">chevron_left</span>
            </button>
            <button onClick={handleNextMonth}>
              <span className="material-symbols-outlined hover:opacity-50">chevron_right</span>
            </button>
          </div>
          <p className="ml-[3%]">{allMonths[selectedMonth]} {selectedYear}</p>
          <section className="ml-auto mr-4">
            <select
              name="months"
              className="border border-gray-300 rounded px-2 py-1"
              value={allMonths[selectedMonth].toLowerCase()}
              onChange={handleMonthChange}
            >
              {allMonths.map((month, idx) => (
                <option key={idx} value={month.toLowerCase()}>
                  {month}
                </option>
              ))}
            </select>
          </section>
        </div>

        <div className="mt-4 ml-4">
          <ul className="flex gap-[7%] font-medium text-gray-600 border-b-2 h-10 border-gray-500 ml-6">
            {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map((d,i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </div>

        <div className="ml-4 mt-4 grid grid-cols-7 gap-2 text-center">
          {daysInMonth.map((day, idx) => (
            <div
              key={idx}
              onClick={() => handleDayClick(day)}
              className={`h-[90px] border border-gray-300 text-gray-500 hover:border-blue-500 hover:text-blue-500 hover:opacity-50 rounded flex flex-col items-center justify-start cursor-pointer ${
                day === null ? "bg-transparent cursor-default" : ""
              } ${selectedDay === day && day !== null ? "border-blue-500 text-blue-500 bg-blue-50" : ""}`}
            >
              {day && (
                <>
                  <div className="font-semibold mt-1">{day}</div>
                  <div className="flex flex-col gap-1 mt-1 w-full px-1">
                    {getEventsForDay(day).map((event, idxE) => (
                      <div
                        key={event.id}
                        className="bg-blue-500 text-white text-[10px] px-1 py-0.5 rounded truncate flex justify-between items-center"
                      >
                        <span
                          onDoubleClick={() => deleteEvent(event.id)}
                          className="flex-1 cursor-pointer"
                          title="Double-cliquez pour supprimer"
                        >
                          {event.title}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteEvent(event.id);
                          }}
                          className="text-xs ml-1 text-white font-bold hover:text-red-300"
                          disabled={loading}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}