import React from "react";

export default function Home() {
  return (
    <div>
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
        </div>
    </div>
  );
}
