import React, { useState, useEffect } from "react";
import axios from "axios";

export default function MyTaxes() {
  const [input, setInput] = useState({ title: "", price: "" });
  const [tache, setTache] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const API_URL = "https://ton-nom-de-projet.onrender.com/pricework";

  // 🔄 Charger les données à l'affichage
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(""); // Reset error
      try {
        console.log('🔍 Chargement des données depuis:', API_URL);
        const response = await axios.get(API_URL);
        console.log('📥 Données reçues:', response.data);
        
        const dataObj = {};
        response.data.forEach((item) => {
          dataObj[item._id] = item;
        });
        setTache(dataObj);
      } catch (err) {
        console.error('❌ Erreur lors du chargement:', err);
        setError("Erreur lors du chargement des données.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ➕ Ajouter un élément
  const handleElement = async () => {
    if (input.title === "" || input.price === "") {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    // Validation du prix
    const priceValue = parseFloat(input.price);
    if (isNaN(priceValue) || priceValue <= 0) {
      setError("Le montant doit être un nombre positif.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // 🔧 CORRECTION : Adaptez les champs selon votre API /pricework
      const requestData = {
        title: input.title.trim(),
        // Testez d'abord avec 'price', si ça ne marche pas, changez pour 'amount'
        price: priceValue
        // Si votre API attend 'amount', utilisez ceci à la place :
        // amount: priceValue
      };

      console.log('📤 Envoi des données:', requestData);
      console.log('🔗 URL:', API_URL);

      const response = await axios.post(API_URL, requestData);
      console.log('📥 Réponse reçue:', response.data);

      // 🔧 CORRECTION : Adaptez selon la structure de réponse de votre API
      let newItem;
      if (response.data.data) {
        newItem = response.data.data; // Si l'API renvoie { data: {...} }
      } else {
        newItem = response.data; // Si l'API renvoie directement l'objet
      }

      console.log('✅ Nouvel élément:', newItem);

      setTache((prev) => ({
        ...prev,
        [newItem._id]: newItem,
      }));

      setInput({ title: "", price: "" });
    } catch (error) {
      console.error("❌ Erreur complète lors de l'ajout:", error);
      
      // Affichage d'erreur plus détaillé
      let errorMessage = "Erreur lors de l'ajout de l'élément.";
      if (error.response) {
        console.error('📛 Erreur serveur:', error.response.data);
        console.error('📛 Status:', error.response.status);
        errorMessage = error.response.data?.error || `Erreur ${error.response.status}`;
      } else if (error.request) {
        console.error('📛 Pas de réponse:', error.request);
        errorMessage = "Pas de réponse du serveur. Vérifiez que le serveur fonctionne.";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      setError("");
      
      console.log('🗑️ Suppression de:', id);
      await axios.delete(`${API_URL}/${id}`);
      
      const updated = { ...tache };
      delete updated[id];
      setTache(updated);
      console.log('✅ Élément supprimé');
    } catch (error) {
      console.error("❌ Erreur suppression:", error);
      let errorMessage = "Erreur lors de la suppression.";
      if (error.response) {
        errorMessage = error.response.data?.error || `Erreur ${error.response.status}`;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 🔧 CORRECTION : Utilisez le bon champ (price ou amount selon votre modèle)
  const total = Object.values(tache).reduce((acc, curr) => {
    // Essayez 'price' d'abord, puis 'amount' si ça ne marche pas
    const value = curr.price || curr.amount || 0;
    return acc + value;
  }, 0);

  return (
    <div className="p-8 w-full max-w-5xl mx-auto h-screen relative">
      {/* Debug Info */}
      <div className="absolute top-2 right-2 bg-gray-100 p-2 rounded text-xs">
        Items: {Object.keys(tache).length} | Total: {total.toFixed(2)}
      </div>

      {/* 💰 Montant total */}
      <div className="absolute top-8 left-8 border rounded-lg w-64 h-64 flex flex-col justify-center items-center bg-white shadow-md">
        <h1 className="font-bold text-5xl text-center text-gray-600">
          {total.toFixed(2)} €
        </h1>
      </div>

      {/* ➕ Formulaire d'ajout */}
      <div className="absolute top-8 left-80 right-8 border rounded-lg h-32 flex flex-col justify-start items-center bg-white shadow-md">
        <h1 className="text-gray-500 font-bold text-2xl text-center mt-4">
          Vos frais professionnels
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-6 px-6 py-4 w-full">
          <input
            type="text"
            value={input.title}
            onChange={(e) => setInput({ ...input, title: e.target.value })}
            className="border rounded py-2 px-4 w-full md:w-1/3"
            placeholder="Élément à vos frais"
          />
          <input
            className="border rounded py-2 px-4 w-full md:w-1/4"
            placeholder="Montant de l'achat"
            type="number"
            name="price"
            step="0.01"
            min="0"
            value={input.price}
            onChange={(e) => setInput({ ...input, price: e.target.value })}
          />
          <button
            onClick={handleElement}
            className={`rounded-lg w-full md:w-32 text-white font-medium text-lg py-2 transition ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
            disabled={loading}
          >
            {loading ? "Ajout..." : "Ajouter"}
          </button>
        </div>
      </div>

      {/* 📋 Liste des achats */}
      <div className="absolute top-[300px] left-8 right-8 bottom-8 border rounded-lg text-gray-500 font-bold shadow-md bg-white flex flex-col">
        <h1 className="text-center p-4 text-[1.4rem] border-b flex-shrink-0">
          Achats effectués ({Object.keys(tache).length})
        </h1>

        {error && (
          <div className="text-red-600 text-center p-2 font-medium bg-red-50 mx-4 mt-2 rounded">
            ❌ {error}
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-4 py-2">
          {loading ? (
            <p className="text-center text-gray-400">Chargement...</p>
          ) : Object.keys(tache).length === 0 ? (
            <p className="text-center text-gray-400 mt-8">Aucun achat enregistré pour le moment</p>
          ) : (
            <ul className="space-y-2">
              {Object.entries(tache).map(([id, element]) => (
                <li
                  key={id}
                  className="flex justify-between items-center border-b py-2 hover:bg-gray-50 px-2 rounded"
                >
                  <div className="flex gap-4">
                    <p className="font-medium">{element.title}</p>
                    <p className="font-bold text-blue-600">
                      {(element.price || element.amount || 0).toFixed(2)} €
                    </p>
                  </div>
                  <button
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition"
                    onClick={() => handleDelete(id)}
                    disabled={loading}
                  >
                    🗑️
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}