import React, { useState, useEffect } from "react";

export default function ContactUI({
  contacts,
  contactList,
  search,
  setSearch,
  handleChange,
  handleSubmit,
  showNameError,
  showEmailError,
  showNumeroError,
  openInfo,
  setOpenInfo,
  menuRef,
  rigthMobile,
}) {
  const [paramsMobile, setParamsMobile] = useState(window.innerWidth < 380);

  useEffect(() => {
    const handleResize = () => {
      setParamsMobile(window.innerWidth < 410);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={`pl-4 relative top-[30px] w-[20%] min-w-[250px] h-10 border border-green-700 rounded-lg outline outline-4 outline-offset-4 outline-green-700 ${rigthMobile ? "ml-[17%]" : "ml-[30%]"}`}
        placeholder="Chercher un contact"
      />

      <div className="justify-between w-full px-8 mt-28 ml-[20%] items-start">
        <div
          className={`flex gap-[30%] mb-4 w-[80%] max-w-[700px] min-w-[370px] border rounded-lg px-4 py-2 font-bold bg-gray-100 ${
            rigthMobile ? "-ml-[20%]" : ""
          }`}
        >
          <span>Nom</span>
          <span>Email</span>
          <span>Contact</span>
        </div>

        <div
          className={`flex flex-col gap-2 w-[58%] min-w-[300px] relative mt-0 text-[100%] mr-[40%] ${
            rigthMobile ? "-ml-[20%]" : ""
          }`}
        >
          {contactList
            .filter(
              (c) =>
                c.name.toLowerCase().includes(search.toLowerCase()) ||
                c.email.toLowerCase().includes(search.toLowerCase()) ||
                c.numero.includes(search)
            )
            .map((c, i) => (
              <div key={i} className="flex gap-[20%] border px-4 py-2 rounded-lg">
                <span>{c.name}</span>
                <span>{c.email}</span>
                <span>{c.numero}</span>
              </div>
            ))}
        </div>
      </div>

      <span
        className={`material-symbols-outlined text-[2.4rem] cursor-pointer absolute top-[30px] left-[65%] ${
          paramsMobile ? "ml-[24%]" : ""
        }`}
        onClick={(e) => {
          e.stopPropagation();
          setOpenInfo((prev) => !prev);
        }}
      >
        settings
      </span>

      {openInfo && (
        <div
          ref={menuRef}
          className="w-[35%] min-w-[300px] bg-gray-100 rounded-xl p-4 absolute right-8 top-20 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <input
                className="border border-black w-full h-10 p-4 rounded-lg"
                type="text"
                placeholder="Ajouter un nom"
                value={contacts.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
              {showNameError && (
                <span className="text-red-500" title="Nom requis">
                  ⚠️
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                className="border border-black w-full h-10 p-4 rounded-lg"
                type="text"
                placeholder="Ajouter un email"
                value={contacts.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
              {showEmailError && (
                <span className="text-red-500" title="Email requis">
                  ⚠️
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                className="border border-black w-full h-10 p-4 rounded-lg"
                type="text"
                placeholder="Ajouter un numéro"
                value={contacts.numero}
                onChange={(e) => handleChange("numero", e.target.value)}
              />
              {showNumeroError && (
                <span className="text-red-500" title="Numéro invalide">
                  ⚠️
                </span>
              )}
            </div>

            <button
              onClick={handleSubmit}
              className="border rounded-xl border-green-400 bg-green-600 text-white px-4 py-2 mt-2 w-[40%]"
            >
              Créer contact
            </button>
          </div>
        </div>
      )}
    </>
  );
}
