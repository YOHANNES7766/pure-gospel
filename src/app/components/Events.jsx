
"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const events = [
  {
    id: 1,
    title: "Sunday Worship Service",
    date: "September 15, 2025",
    time: "10:00 AM - 12:00 PM",
    location: "Main Sanctuary",
    description: "Join us for a powerful time of worship and the Word.",
    image: "https://images.unsplash.com/photo-1508780709619-79562169bc64?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Youth Fellowship Night",
    date: "September 20, 2025",
    time: "6:00 PM - 8:30 PM",
    location: "Youth Hall",
    description:
      "An evening of fun, games, worship, and encouragement for the youth.",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Community Outreach",
    date: "September 25, 2025",
    time: "2:00 PM - 5:00 PM",
    location: "City Center",
    description:
      "Join us as we reach out to our community with love and support.",
    image: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=800&q=80",
  },
];

const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <section id="events" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center text-blue-700 mb-12"
        >
          Upcoming Events
        </motion.h2>

        {/* Events Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <motion.div
              key={event.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer"
              whileHover={{ scale: 1.03, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedEvent(event)}
            >
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {event.title}
                </h3>
                <p className="text-sm text-gray-500 mb-1">
                  📅 {event.date} | 🕒 {event.time}
                </p>
                <p className="text-sm text-gray-500 mb-3">📍 {event.location}</p>
                <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                <button
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEvent(event);
                  }}
                >
                  Learn More
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {selectedEvent && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
            >
              <motion.div
                className="bg-white rounded-2xl shadow-lg max-w-lg w-full p-6 relative"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
                  onClick={() => setSelectedEvent(null)}
                >
                  ✖
                </button>
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="w-full h-56 object-cover rounded-lg mb-4"
                />
                <h3 className="text-2xl font-bold mb-2 text-blue-700">
                  {selectedEvent.title}
                </h3>
                <p className="text-gray-500 mb-1">
                  📅 {selectedEvent.date} | 🕒 {selectedEvent.time}
                </p>
                <p className="text-gray-500 mb-3">📍 {selectedEvent.location}</p>
                <p className="text-gray-700">{selectedEvent.description}</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Events;
