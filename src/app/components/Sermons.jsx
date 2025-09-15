"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const sermons = [
  {
    id: 1,
    title: "Walking in Faith",
    preacher: "Pastor John Doe",
    date: "September 1, 2025",
    description: "A powerful sermon about trusting God in every season of life.",
    videoUrl: "https://www.youtube.com/embed/qcxUoRpI_1U", // ✅ embed link
    thumbnail:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Power of Prayer",
    preacher: "Pastor Jane Smith",
    date: "August 25, 2025",
    description: "Exploring the importance and impact of consistent prayer.",
    videoUrl: "https://www.youtube.com/embed/qcxUoRpI_1U", // ✅ embed link
    thumbnail:
      "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Living with Purpose",
    preacher: "Pastor Michael Lee",
    date: "August 18, 2025",
    description:
      "Discovering God’s purpose for your life and walking in it daily.",
    videoUrl: "https://www.youtube.com/embed/qcxUoRpI_1U", // ✅ embed link
    thumbnail:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80",
  },
];

const Sermons = () => {
  const [activeSermon, setActiveSermon] = useState(null);

  return (
    <section
      id="sermons"
      className="py-20 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center text-blue-700 mb-12"
        >
          Sermons & Media
        </motion.h2>

        {/* Sermons Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {sermons.map((sermon, i) => (
            <motion.div
              key={sermon.id}
              className="bg-gray-50 rounded-2xl shadow-md overflow-hidden cursor-pointer group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
              }}
              onClick={() => setActiveSermon(sermon)}
            >
              <div className="relative">
                <img
                  src={sermon.thumbnail}
                  alt={sermon.title}
                  className="w-full h-48 object-cover group-hover:brightness-75 transition-all"
                />
                <motion.div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <div className="bg-white text-blue-600 px-4 py-2 rounded-full font-semibold shadow">
                    ▶ Play
                  </div>
                </motion.div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                  {sermon.title}
                </h3>
                <p className="text-sm text-gray-500 mb-1">
                  🎤 {sermon.preacher}
                </p>
                <p className="text-sm text-gray-500 mb-3">📅 {sermon.date}</p>
                <p className="text-gray-600 line-clamp-3">
                  {sermon.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Livestream CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Join Our Livestream
          </h3>
          <a
            href="https://www.youtube.com/embed/Q1aqsp0BjwA" // ✅ changed to embed
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-red-600 text-white py-3 px-6 rounded-xl shadow hover:bg-red-700 transition-colors"
          >
            Watch Live
          </a>
        </motion.div>

        {/* Modal for Video Playback */}
        <AnimatePresence>
          {activeSermon && (
            <motion.div
              className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveSermon(null)}
            >
              <motion.div
                className="bg-white rounded-2xl shadow-lg max-w-3xl w-full overflow-hidden relative"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl"
                  onClick={() => setActiveSermon(null)}
                >
                  ✖
                </button>
                <iframe
                  src={activeSermon.videoUrl}
                  title={activeSermon.title}
                  className="w-full aspect-video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-blue-700 mb-2">
                    {activeSermon.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-1">
                    🎤 {activeSermon.preacher} | 📅 {activeSermon.date}
                  </p>
                  <p className="text-gray-700">{activeSermon.description}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Sermons;
