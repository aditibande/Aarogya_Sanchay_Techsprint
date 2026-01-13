import React, { useState, useEffect } from "react";
import healthRecords from "../assets/health record.jpg";
import reminders from "../assets/reminders.jpg";
import chatbot from "../assets/Chatbot.jpg";
import idCard from "../assets/id-card.jpg";

const slides = [
  {
    image: idCard,
    text: "🆔 Each worker gets a unique Digital Health ID",
  },
  {
    image: healthRecords,
    text: "📒 Access all medical records anytime, anywhere",
  },
  {
    image: reminders,
    text: "🔔 Get reminders for checkups and vaccinations",
  },
  {
    image: chatbot,
    text: "💬 Talk to our chatbot for quick health tips and info",
  },
];

export default function Slider() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setPrev(current);
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [current]);

  return (
    <div className="flex flex-col justify-center items-center relative bg-green-50 p-6 rounded-lg shadow-lg h-full overflow-hidden">
      <div className="w-full h-96 relative">
        {slides.map((slide, index) => {
          let className = "absolute top-0 left-0 w-full h-full object-contain rounded-lg transition-all";

          if (index === current) {
            className += " translate-x-0 opacity-100 z-20 duration-500";
          } else if (index === prev) {
            className += " -translate-x-full opacity-0 z-10 duration-800";
          } else {
            className += " translate-x-full opacity-0 z-0"; 
          }

          return <img key={index} src={slide.image} alt="feature" className={className} />;
        })}
      </div>
      <p className="text-lg font-medium text-gray-700 text-center mt-4">
        {slides[current].text}
      </p>
      <div className="flex mt-4 space-x-2">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === current ? "bg-green-600" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
