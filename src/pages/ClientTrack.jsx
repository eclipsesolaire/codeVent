import React, { useState, useEffect, useRef } from "react";
import ContactUI from "../components/ContactUI";

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
}

export default function ClientTrack() {
  const [contacts, setContacts] = useState({ name: "", email: "", numero: "" });
  const [contactList, setContactList] = useState([]);
  const [search, setSearch] = useState("");

  const [showNameError, setShowNameError] = useState(false);
  const [showEmailError, setShowEmailError] = useState(false);
  const [showNumeroError, setShowNumeroError] = useState(false);

  const [openInfo, setOpenInfo] = useState(false);
  const menuRef = useRef(null);

  const rigthMobile = useIsMobile();

  useEffect(() => {
    document.body.style.overflowX = "hidden";
    return () => {
      document.body.style.overflowX = "auto";
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenInfo(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleChange = (field, value) => {
    setContacts((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    let hasError = false;

    if (contacts.name.trim() === "") {
      setShowNameError(true);
      setTimeout(() => setShowNameError(false), 3000);
      hasError = true;
    }

    if (contacts.email.trim() === "") {
      setShowEmailError(true);
      setTimeout(() => setShowEmailError(false), 3000);
      hasError = true;
    }

    const containsInvalidChar = contacts.numero
      .split("")
      .reduce((acc, char) => (char !== " " && !"0123456789".includes(char) ? true : acc), false);

    if (contacts.numero.trim() === "" || containsInvalidChar) {
      setShowNumeroError(true);
      setTimeout(() => setShowNumeroError(false), 3000);
      hasError = true;
    }

    if (hasError) return;

    setContactList((prev) => [...prev, contacts]);
    setContacts({ name: "", email: "", numero: "" });
    setOpenInfo(false);
  };

  return (
    <ContactUI
      contacts={contacts}
      contactList={contactList}
      search={search}
      setSearch={setSearch}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      showNameError={showNameError}
      showEmailError={showEmailError}
      showNumeroError={showNumeroError}
      openInfo={openInfo}
      setOpenInfo={setOpenInfo}
      menuRef={menuRef}
      rigthMobile={rigthMobile}
    />
  );
}
