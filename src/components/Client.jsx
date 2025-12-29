import React, { useState, useEffect } from "react";

const API_BASE_URL = 'http://localhost:3000/api';

const callApi = async (endpoint, options = {}) => {
    const defaultOptions = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers
            }
        });

        if (!response.ok) {
            if (response.headers.get('content-type')?.includes('application/json')) {
                const error = await response.json();
                throw new Error(error.message || 'Erreur lors de l\'opération');
            }
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`❌ Erreur API (${endpoint}):`, error);
        throw error;
    }
};

export default function Client() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [contacts, setContacts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Charger les clients au démarrage
    const fetchClients = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await callApi('/clients');
            setContacts(data.map(client => ({
                ...client,
                id: client._id
            })));
        } catch (error) {
            setError('Erreur lors du chargement des clients');
            console.log('Tentative de reconnexion dans 5 secondes...');
            setTimeout(fetchClients, 5000);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    // no separate selection state: use `accepted` flag on each contact

    // simple controlled inputs for adding a contact
    const [newName, setNewName] = useState("");
    const [newContact, setNewContact] = useState("");
    const [contactType, setContactType] = useState("email"); // "email" ou "phone"

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // toggle accepted flag for a contact (checked/unchecked)
    const toggleAccepted = async (contactId) => {
        try {
            const contact = contacts.find(c => c.id === contactId);
            const updatedClient = await callApi(`/clients/${contactId}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    accepted: !contact.accepted,
                }),
            });

            setContacts(prev =>
                prev.map(c =>
                    c.id === contactId
                        ? { ...updatedClient, id: updatedClient._id }
                        : c
                )
            );
        } catch (error) {
            alert('Erreur lors de la mise à jour du client');
        }
    };

    const deleteContact = async (contactId) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) {
            return;
        }
        
        try {
            const response = await fetch(`http://localhost:3000/api/clients/${contactId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erreur lors de la suppression du client');
            }

            setContacts(prev => prev.filter(c => c.id !== contactId));
        } catch (error) {
            console.error('❌ Erreur suppression client:', error);
            alert(error.message || 'Erreur lors de la suppression du client');
        }
    };

    const addContact = async () => {
        try {
            // Validation
            if (!newName.trim() || !newContact.trim()) {
                alert("Le nom et le contact sont requis");
                return;
            }

            // Validation du contact selon le type
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const phoneRegex = /^[0-9+\s-]{8,}$/;
            
            const isValidContact = contactType === "email" ? 
                emailRegex.test(newContact.trim()) : 
                phoneRegex.test(newContact.trim());

            if (!isValidContact) {
                alert(contactType === "email" ? 
                    "Veuillez entrer un email valide" : 
                    "Veuillez entrer un numéro de téléphone valide (minimum 8 chiffres)");
                return;
            }

            const newClient = await callApi('/clients', {
                method: 'POST',
                body: JSON.stringify({
                    name: newName.trim(),
                    contact: newContact.trim(),
                    accepted: false,
                }),
            });

            setContacts(prev => [...prev, { ...newClient, id: newClient._id }]);
            setNewName("");
            setNewContact("");
        } catch (error) {
            alert(error.message || 'Erreur lors de la création du client');
        }
    };

    const acceptedContacts = contacts.filter((c) => c.accepted);

    return (
        <div className={`min-h-screen bg-gray-50 ${isMobile ? 'pt-20' : 'pt-8'}`}>
            <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isMobile ? 'w-full' : 'w-[calc(100%-240px)] ml-auto'}`}>
                <h1 className="text-3xl font-bold text-gray-900 text-center mb-8 lg:mb-12">
                    Gestion des Clients
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
                    {/* Bloc Personnes à contacter */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-4 lg:px-6 py-4 flex items-center justify-between">
                            <h2 className="text-lg lg:text-xl font-semibold text-white">Personnes à contacter</h2>
                            <span className="text-sm text-blue-100">{contacts.length} contact(s)</span>
                        </div>
                        <div className="p-4 lg:p-6 flex flex-col h-[420px]">
                            <div className="flex-1 overflow-y-auto space-y-3 lg:space-y-4">
                                {contacts.length === 0 && (
                                    <div className="text-sm text-gray-500">Aucun contact pour le moment.</div>
                                )}
                                {contacts.map((c) => (
                                    <div key={c.id} className="bg-gray-50 p-3 lg:p-4 rounded-lg flex items-center justify-between">
                                        <div className="flex items-center space-x-3 w-full">
                                            <label className="flex items-center space-x-3 w-full cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={!!c.accepted}
                                                    onChange={() => toggleAccepted(c.id)}
                                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                                />
                                                <div className="flex items-center space-x-3 flex-1">
                                                    <div className="flex-shrink-0">
                                                        <span className="h-8 w-8 lg:h-10 lg:w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                            <svg className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                            </svg>
                                                        </span>
                                                    </div>
                                                    <div className="min-w-0 flex-grow">
                                                        <h3 className="text-sm font-medium text-gray-900 truncate">{c.name}</h3>
                                                        <p className="text-sm text-gray-500 truncate">{c.contact}</p>
                                                    </div>
                                                </div>
                                            </label>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    deleteContact(c.id);
                                                }}
                                                className="ml-2 p-1 text-red-600 hover:text-red-800 transition-colors"
                                                title="Supprimer"
                                            >
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 lg:mt-6">
                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                                    <input
                                        type="text"
                                        placeholder="Nom..."
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                                    />
                                    <select
                                        value={contactType}
                                        onChange={(e) => setContactType(e.target.value)}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                                    >
                                        <option value="email">Email</option>
                                        <option value="phone">Téléphone</option>
                                    </select>
                                    <input
                                        type={contactType === "email" ? "email" : "tel"}
                                        placeholder={contactType === "email" ? "email@exemple.com" : "06 12 34 56 78"}
                                        value={newContact}
                                        onChange={(e) => setNewContact(e.target.value)}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                                    />
                                    <div className="sm:col-span-3 flex justify-end">
                                        <button onClick={addContact} className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                                            Ajouter
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bloc Personnes acceptées */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-green-600 to-green-800 px-4 lg:px-6 py-4 flex items-center justify-between">
                            <h2 className="text-lg lg:text-xl font-semibold text-white">Personnes acceptées</h2>
                            <span className="text-sm text-green-100">{acceptedContacts.length} accepté(s)</span>
                        </div>
                        <div className="p-4 lg:p-6 flex flex-col h-[420px]">
                            <div className="flex-1 overflow-y-auto space-y-3 lg:space-y-4">
                                {acceptedContacts.length === 0 && (
                                    <div className="text-sm text-gray-500">Aucun client accepté pour le moment.</div>
                                )}
                                {acceptedContacts.map((a) => (
                                    <div key={a.id} className="bg-gray-50 p-3 lg:p-4 rounded-lg flex items-center space-x-3">
                                        <div className="flex-shrink-0">
                                            <span className="h-8 w-8 lg:h-10 lg:w-10 rounded-full bg-green-100 flex items-center justify-center">
                                                <svg className="h-5 w-5 lg:h-6 lg:w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </span>
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-sm font-medium text-gray-900 truncate">{a.name}</h3>
                                            <p className="text-sm text-gray-500 truncate">Accepté le {a.acceptedAt}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 lg:mt-6">
                                <input
                                    type="text"
                                    placeholder="Rechercher une personne acceptée..."
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
