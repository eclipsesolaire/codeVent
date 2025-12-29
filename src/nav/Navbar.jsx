import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isOpen, setIsOpen] = useState(true); // menu visible par défaut

  // Gérer le redimensionnement écran
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setIsOpen(true); // sur desktop toujours visible
      if (mobile) setIsOpen(false); // sur mobile par défaut fermé
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // appel initial pour définir état au chargement

    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Bouton hamburger pour ouvrir menu (mobile seulement & menu fermé) */}
      {isMobile && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 text-green-600 text-[2.1rem] z-50"
          aria-label="Open menu"
        >
          ☰
        </button>
      )}

      {/* Menu */}
      {isOpen && (
        <nav className="fixed left-0 top-0 bg-black w-[8%] h-full min-w-[120px] z-50 shadow-lg">
          <ul className="text-white font-bold text-[1.3rem] ml-[10%] mt-[80px] space-y-[30px]">
            {/* Bouton close visible uniquement sur mobile */}
            {isMobile && (
              <span
                onClick={() => setIsOpen(false)}
                className="material-symbols-outlined absolute top-4 left-[70%] hover:opacity-30 text-[2.2rem] cursor-pointer"
                role="button"
                aria-label="Close menu"
              >
                close
              </span>
            )}
            <li >
              <Link
                to="/"
                 onClick={() => isMobile && setIsOpen(false)}
                className="flex items-center gap-4 py-[6%] w-[125%] -ml-[30%] px-14 rounded-lg h-[18%] hover:bg-white hover:text-green-600  transition duration-300 ease-in-out"
              >
                <span className="material-symbols-outlined">home</span>
                {/* Home */}
              </Link>
            </li>
            <li>
              <Link
                to="/clients"
                 onClick={() => isMobile && setIsOpen(false)}
                className="flex gap-4 py-[6%] w-[125%] -ml-[30%] px-14 rounded-lg h-[18%] hover:bg-green-600 hover:bg-white hover:text-green-600  hover:bg-white transition duration-300 ease-in-out"
              >
                <span className="material-symbols-outlined decoration-inherit">
                  group
                </span>
                {/* Clients */}
              </Link>
            </li>
            <li>
              <Link
                to="/income"
                 onClick={() => isMobile && setIsOpen(false)}
                className="flex gap-4 py-[6%] w-[125%] -ml-[30%] px-14 rounded-lg h-[18%] hover:bg-green-600 hover:bg-white hover:text-green-600  hover:bg-white transition duration-300 ease-in-out"
              >
                <span className="material-symbols-outlined decoration-inherit">
                  payments
                </span>
                {/* Incomes */}
              </Link>
            </li>
            <li >
              <Link
                to="/calandar"
                 onClick={() => isMobile && setIsOpen(false)}
                className="flex gap-4 py-[6%] w-[125%] -ml-[30%] px-14 rounded-lg h-[18%] hover:bg-green-600 hover:bg-white hover:text-green-600 hover:bg-white transition duration-300 ease-in-out"
              >
                <span className="material-symbols-outlined">calendar_month</span>
                {/* Calandar */}
              </Link>
            </li>

          </ul>
        </nav>
      )}
    </>
  );
}
