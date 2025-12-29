import React, { useState, useEffect } from "react";
import axios from "axios";
 
export default function CalandarDay() {
  const now = new Date();

  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [startIndex, setStartIndex] = useState(new Date(year, month, 1).getDay());
  const [selectedDay, setSelectedDay] = useState(now.getDate());
  const [events, setEvents] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: "", start: "", end: "" });

  const API_URL = "https://ton-nom-de-projet.onrender.com/calandarday";

  const daysToShow = 7;
  const week = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const allMonths = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];


  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Génère un tableau [1, 2, ..., daysInMonth]
  const allDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Affiche les 7 jours visibles à partir de startIndex
  const visibleDays = allDays.slice(startIndex, startIndex + daysToShow);

  // Au chargement du composant ET quand year/month changent, récupère les événements
  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        const res = await axios.get(API_URL);
        console.log("Événements récupérés:", res.data); 
        setEvents(res.data);
      } catch (error) {
        console.error("Erreur récupération événements :", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, [year, month]);

  // Navigation semaine précédente
  const handlePrev = () => {
    if (startIndex - daysToShow < 0) {
      if (month === 0) {
        setYear(year - 1);
        setMonth(11);
      } else {
        setMonth(month - 1);
      }
      // Met à jour startIndex au dernier jour possible du mois précédent
      const prevMonthDays = new Date(
        month === 0 ? year - 1 : year,
        month === 0 ? 11 : month - 1,
        0
      ).getDate();
      setStartIndex(Math.max(prevMonthDays - daysToShow, 0));
    } else {
      setStartIndex(startIndex - daysToShow);
    }
  };

  // Navigation semaine suivante
  const handleNext = () => {
    if (startIndex + daysToShow >= daysInMonth) {
      // On avance d'un mois
      if (month === 11) {
        setYear(year + 1);
        setMonth(0);
      } else {
        setMonth(month + 1);
      }
      setStartIndex(0);
    } else {
      setStartIndex(startIndex + daysToShow);
    }
  };


  const handleDayClick = (day) => {
    setSelectedDay(day);
  };

  // Ouvre le formulaire d'ajout
  const handleAddClick = () => {
    setOpenForm(true);
  };

  // Gestion des inputs du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Soumission du formulaire d'ajout
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const newEvent = {
      day: selectedDay,
      title: formData.title.trim(),
      start: parseFloat(formData.start),
      end: parseFloat(formData.end),
      year, 
      month,
    };

    if (newEvent.start >= newEvent.end) {
      alert("L'heure de fin doit être après l'heure de début");
      return;
    }

    if (!newEvent.title) {
      alert("Le titre est requis");
      return;
    }

    try {
      setLoading(true);
      console.log("Envoi événement:", newEvent); 
      const res = await axios.post(API_URL, newEvent);
      console.log("Réponse backend:", res.data); 
      
      // On ajoute l'événement retourné par le backend dans le state
      setEvents((prev) => [...prev, res.data]);
      setOpenForm(false);
      setFormData({ title: "", start: "", end: "" });
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'événement :", error);
      alert("Erreur lors de l'ajout de l'événement");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (idToDelete) => {
  try {
    setLoading(true);
    console.log("Suppression d’un événement avec ID:", idToDelete);

    await axios.delete(`${API_URL}/${idToDelete}`);

    // Supprimer l’événement du state sans recharger
    setEvents((prev) => prev.filter((e) => e._id !== idToDelete));
  } catch (error) {
    console.error("Erreur lors de la suppression de l’événement :", error);
    alert("Erreur lors de la suppression");
  } finally {
    setLoading(false);
  }
};


  // Formatage heure décimale en "HHhMM"
  const formatTime = (hourDecimal) => {
    const hour = Math.floor(hourDecimal);
    const minutes = Math.round((hourDecimal - hour) * 60);
    return `${hour}h${minutes === 0 ? "00" : minutes.toString().padStart(2, '0')}`;
  };

  // FILTRAGE DES ÉVÉNEMENTS avec logs pour débugger
  const filteredEvents = events.filter((e) => {
    const match = (
      e.day === selectedDay && e.month === month && e.year === year
    );
    
    // Pour débugger
    if (events.length > 0) {
      console.log(`Événement: ${e.title}, jour:${e.day}/${e.month}/${e.year}, recherché:${selectedDay}/${month}/${year}, match:${match}`);
    }
    
    return match;
  });

  return (
    <div>
      {/* HEADER */}
      <div className="ml-[30%] flex gap-[6%] mt-[10px] border-b-2 pt-2 w-[50%]">
        <h2 className="text-[1.7rem] font-bold">Planning</h2>
        <p className="text-[1.2rem] mt-[10px]">{allMonths[month]} {year}</p>
        <div className="flex gap-4 ml-[2%] mt-[10px]">
          <button onClick={handlePrev} aria-label="Semaine précédente">
            <span className="material-symbols-outlined hover:opacity-50">chevron_left</span>
          </button>
          <button onClick={handleNext} aria-label="Semaine suivante">
            <span className="material-symbols-outlined hover:opacity-50">chevron_right</span>
          </button>
        </div>
      </div>

      {/* LABELS JOURS */}
      <ul className="ml-[26%] mt-[1rem] flex gap-[9%] font-semibold text-gray-600">
        {visibleDays.map((day) => {
          const jsDay = new Date(year, month, day).getDay();
          const adjustedIndex = jsDay === 0 ? 6 : jsDay - 1;
          return (
            <li
              key={day}
              onClick={() => handleDayClick(day)}
              className="cursor-pointer select-none"
              style={{ userSelect: "none" }}
              title={`Voir événements du ${day} ${allMonths[month]}`}
            >
              {week[adjustedIndex]}
            </li>
          );
        })}
      </ul>

      {/* NUMÉROS JOURS */}
      <div className="ml-[27%] mt-4 flex gap-[7%] text-gray-700 text-lg">
        {visibleDays.map((day) => (
          <div
            key={day}
            onClick={() => handleDayClick(day)}
            className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer select-none
              ${selectedDay === day ? "bg-blue-700 text-white" : "bg-gray-200"}
            `}
            title={`Jour ${day}`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* AGENDA */}
      <div className="ml-[30%] mt-10 w-[40%] border border-gray-300 relative h-[1050px] bg-white">
        {/* Heures de 7h à 28h */}
        {Array.from({ length: 14 }, (_, i) => {
          const hour = i + 7;
          return (
            <div
              key={hour}
              className="border-t border-gray-200 text-sm text-gray-500 h-[75px] pl-2 relative select-none"
            >
              {hour}:00
            </div>
          );
        })}

        {/* Bouton Ajouter */}
        <span
          className="material-symbols-outlined absolute text-[2rem] top-4 right-4 cursor-pointer text-gray-600 hover:text-black"
          title="Ajouter un événement"
          onClick={handleAddClick}
          role="button"
          tabIndex={0}
          onKeyDown={e => { if(e.key === "Enter") handleAddClick(); }}
        >
          add
        </span>

        {/* AFFICHAGE ÉVÉNEMENTS CORRIGÉ */}
        {filteredEvents.map((e, i) => (
          <div
            key={e._id || i} // Utilise l'ID MongoDB si disponible
            className="absolute bg-blue-500 text-white px-2 py-1 text-sm rounded-md shadow-md"
            style={{
              top: `${(e.start - 7) * 75}px`,
              height: `${(e.end - e.start) * 75}px`,
              left: "10%",
              width: "80%",
            }}
            title={`${e.title} (${formatTime(e.start)} - ${formatTime(e.end)})`}
          >
            <h2 onClick={() => handleDelete(e._id)}
             className="absolute text-white text-[1.1rem] font-bold ml-[92%] hover:text-orange-500 cursor-pointer">X</h2>
            <strong >{e.title}</strong>
            <div className="text-xs">{formatTime(e.start)} - {formatTime(e.end)}</div>
          </div>
        ))}

        {/* Message si aucun événement */}
        {filteredEvents.length === 0 && !loading && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400 text-center">
            <p>Aucun événement pour le {selectedDay} {allMonths[month]} {year}</p>
            <p className="text-sm">Cliquez sur + pour ajouter un événement</p>
          </div>
        )}

        {/* Indicateur de chargement */}
        {loading && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-500">
            Chargement...
          </div>
        )}
      </div>

      {/* FORMULAIRE AJOUT */}
      {openForm && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex justify-center items-center z-50">
          <form
            onSubmit={handleFormSubmit}
            className="bg-white p-6 rounded-lg shadow-lg w-[300px] flex flex-col gap-3"
          >
            <h3 className="text-lg font-bold mb-2">
              Ajouter un événement - {selectedDay} {allMonths[month]} {year}
            </h3>
            <input
              type="text"
              name="title"
              placeholder="Titre"
              value={formData.title}
              onChange={handleInputChange}
              className="border p-2 rounded"
              required
              autoFocus
            />
            <input
              type="number"
              name="start"
              step="0.5"
              min="7"
              max="18"
              placeholder="Début (ex: 9.5 pour 9h30)"
              value={formData.start}
              onChange={handleInputChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              name="end"
              step="0.5"
              min="7"
              max="18"
              placeholder="Fin (ex: 10.5 pour 10h30)"
              value={formData.end}
              onChange={handleInputChange}
              className="border p-2 rounded"
              required
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => {
                  setOpenForm(false);
                  setFormData({ title: "", start: "", end: "" });
                }}
                className="text-sm text-gray-600 hover:text-gray-800"     
              >
                Annuler
              </button>
              <button
                type="submit"
                className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Ajout..." : "Ajouter"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}