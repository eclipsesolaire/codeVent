// src/pages/Incomio.jsx
import React, { useEffect} from "react";
import { Link } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid
} from "recharts";

export default function Incomio() {
  const sampleData = [
    { month: "Nov", revenue: 500 },
    { month: "Dec", revenue: 250 },
    { month: "Jan", revenue: 100 }
  ];

  const miniDeals = [
    { month: "Jun", won: 100, lost: 20 },
    { month: "Jul", won: 500, lost: 50 },
    { month: "Aug", won: 200, lost: 120 },
    { month: "Sept", won: 600, lost: 20 },
    { month: "Oct", won: 100, lost: 50 },
    
  ];

  const miniTaxes = [
    { month: "Jun", tax: 80 },
    { month: "Jul", tax: 120 },
    { month: "Aug", tax: 60 },
    { month: "sept", tax: 20 },
    { month: "Aug", tax: 40 },
  ];

   useEffect(() => {
    // Bloque le scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);
  
  return (
    <div className="ml-[12%] mt-4 w-[100%]">

      {/* Grille des aperçus */}
      <div className="flex flex-colums  gap-6 ">
         
        <Link
          to="/myWorkSpend"
          className="transition hover:scale-105 duration-300 shadow-md border border-gray-200 p-2 rounded-md w-[20%]"
        >
          <p className="text-[1.3rem] ml-[93%] text-gray-500 ">$</p>
          <h2 className="font-meduim pl-[5%]">Work expense </h2>
          <p className=" mt-4 px-[20%] font-bold text-[1.5rem]">$103,000.30</p>
          <p className="ml-4 text-gray-500 mt-4">total expense</p></Link>
          


        <Link
          to="/incomeGrap"
          className="hover:scale-[1.02] transition-all duration-300 w-[280px] border p-2 shadow hover:shadow-lg bg-white rounded"
        >
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={sampleData}>
              <XAxis dataKey="month" hide />
              <YAxis hide />
              <Tooltip />
              <Bar dataKey="revenue" fill="#4129c4ff" />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-center mt-2 text-sm text-gray-500">Voir profil brute </p>
        </Link>

      

        {/* Impôts */}
        <Link
          to="/myTaxes"
          className="hover:scale-[1.02] transition-all duration-300 shadow-md border border-gray-200 p-8 rounded-md w-[35%]"
        >
          <ResponsiveContainer width="100%" height={100}>
            <LineChart data={miniTaxes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis unit="€" />
              <Tooltip />
              <Line type="monotone" dataKey="tax" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-center mt-2 text-sm text-gray-500">Voir les impôts reçus</p>
        </Link>
      </div>
     
     <div className="flex ">
      <div className="w-[50%] mt-[17px] border p-2 shadow hover:shadow-lg bg-white rounded hover:scale-[1.02] transition-all duration-300">
        {/* Deals */}
        <h1 className="font-bold pl-[6%]">Bilan financier</h1>
        <p className="p-2 pl-[6%]">Revenue total par jour et par mois </p>
        <Link
          to="/mySpend"
          className=""
        >
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={miniDeals}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="won" stroke="#82ca9d" />
              <Line type="monotone" dataKey="lost" stroke="#ff6b6b" />
            </LineChart>
          </ResponsiveContainer>
        </Link>
    </div>
    
   <Link
  to="/client"
  className=" max-w-xl w-[30%] ml-[1%] mt-[20px] bg-white border rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 p-5 ml-6"
>
  <div className="flex items-center justify-between mb-4">
    <h1 className="text-lg font-bold text-gray-800">The Full Client</h1>
    <span className="material-symbols-outlined text-gray-500">group</span>
  </div>

  <div className="flex flex-col gap-3">
    {[
      { initials: "MD", email: "marie.dupont93@gmail.com" },
      { initials: "TR", email: "thomas.ribeiro76@outlook.com" },
      { initials: "LB", email: "laetitia-benoit@live.fr" },
      { initials: "EC", email: "enzo.carre04@yahoo.fr" },
      { initials: "FR", email: "contact.clientpro@orange.fr" },
    ].map((client, index) => (
      <div key={index} className="flex items-center gap-4">
        <div className="w-9 h-9 flex items-center justify-center bg-gray-200 font-semibold text-gray-700 rounded-full">
          {client.initials}
        </div>
        <span
          onClick={() => window.open(`mailto:${client.email}`, '_blank')}
          className="text-sm text-gray-700 hover:underline break-all cursor-pointer"
        >
          {client.email}
        </span>
      </div>
    ))}
  </div>
</Link>

     </div>
     
     </div>
      
  );
}
