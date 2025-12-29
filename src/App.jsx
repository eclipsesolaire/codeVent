// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ClientTrack from "./pages/ClientTrack";
import Incomio from "./pages/Incomio";
import Navbar from "./nav/Navbar";
import Calandar from "./pages/Calandar";
import CalandarDay from "./components/CalandarDay";
import IncomeGrap from "./components/IncomeGrap";
import MySpend from "./components/MySpend";
import MyTaxes from "./components/MyTaxes";
import MyWorkSpend from "./components/MyWorkSpend";
import Client from "./components/Client";
export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/clients" element={<ClientTrack />} />
        <Route path="/income" element={<Incomio />} />
        <Route path="/calandar" element={<Calandar />} />
        <Route path="/calandarDay" element={<CalandarDay />} />
        <Route path="/incomeGrap" element={<IncomeGrap />} />
        <Route path="/mySpend" element={<MySpend />} />
        <Route path="/myTaxes" element={<MyTaxes />} />
        <Route path="/myWorkSpend" element={<MyWorkSpend />} />
        <Route path="/client" element={<Client />} />

      </Routes>
    </BrowserRouter>
  );
}

