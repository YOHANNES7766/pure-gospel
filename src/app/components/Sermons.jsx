"use client";

import React from "react";
import { motion } from "framer-motion";

const sermons = [
  {
    id: 1,
    title: "Walking in Faith",
    preacher: "Pastor John Doe",
    date: "September 1, 2025",
    description: "A powerful sermon about trusting God in every season of life.",
    videoId: "qcxUoRpI_1U", // keep just the ID for flexibility
  },
  {
    id: 2,
    title: "Power of Prayer",
    preacher: "Pastor Jane Smith",
    date: "August 25, 2025",
    description: "Exploring the importance and impact of consistent prayer.",
    videoId: "qcxUoRpI_1U",
  },
  {
    id: 3,
    title: "Living with Purpose",
    preacher: "Pastor Michael Lee",
    date: "August 18, 2025",
    description:
      "Discovering God’s purpose for your life and walking in it daily.",
    videoId: "qcxUoRpI_1U",
  },
];

const Sermons = () => {
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
              className="bg-gray-50 rounded-2xl shadow-md overflow-hidden group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Autoplay + Loop Video */}
              <div className="relative w-full h-48">
                <iframe
                  src={`https://www.youtube.com/embed/${sermon.videoId}?autoplay=1&mute=1&loop=1&playlist=${sermon.videoId}&controls=0&modestbranding=1&rel=0`}
                  title={sermon.title}
                  className="w-full h-full object-cover rounded-t-2xl"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              {/* Info */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                  {sermon.title}
                </h3>
                <p className="text-sm text-gray-500 mb-1">🎤 {sermon.preacher}</p>
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
            href="https://www.youtube.com/embed/Q1aqsp0BjwA?autoplay=1&mute=1&loop=1&playlist=Q1aqsp0BjwA&controls=0&modestbranding=1&rel=0"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-red-600 text-white py-3 px-6 rounded-xl shadow hover:bg-red-700 transition-colors"
          >
            Watch Live
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Sermons;
