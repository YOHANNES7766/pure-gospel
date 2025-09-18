"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react"; // icons

export default function Hero() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <section
      id="hero"
      className="relative w-full h-screen flex items-center justify-center text-center bg-gray-900 bg-[url('/church-bg.jpeg')] bg-cover bg-center scroll-mt-16"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Menu Button (Top Left) */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="absolute top-6 left-6 z-20 text-white p-2 rounded-lg bg-black/40 hover:bg-black/60 transition"
      >
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-0 left-0 h-full w-2/3 sm:w-1/3 bg-white shadow-lg z-30 flex flex-col items-start p-6 animate-slideInLeft">
          <button
            onClick={() => setMenuOpen(false)}
            className="self-end mb-6 text-gray-700"
          >
            <X size={28} />
          </button>
          <nav className="flex flex-col gap-4 text-lg font-semibold text-gray-800">
            <Link href="#about" onClick={() => setMenuOpen(false)}>
              About Us
            </Link>
            <Link href="#ministries" onClick={() => setMenuOpen(false)}>
              Ministries
            </Link>
            <Link href="#events" onClick={() => setMenuOpen(false)}>
              Events
            </Link>
            <Link href="#contact" onClick={() => setMenuOpen(false)}>
              Contact
            </Link>
          </nav>
        </div>
      )}

      {/* Content */}
      <div className="relative px-6 sm:px-8 md:px-12 text-white max-w-3xl z-10 animate-fadeIn">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-4">
          Welcome to <span className="text-blue-400">Pure Gospel</span>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-8 opacity-90">
          A Christ-centered community sharing God’s Word with love and truth.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="https://t.me/purechur"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition transform hover:scale-105 font-semibold shadow-lg"
          >
            Join Us
          </Link>
          <Link
            href="/watch-live"
            className="px-6 py-3 rounded-lg bg-white text-blue-700 hover:bg-gray-100 transition transform hover:scale-105 font-semibold shadow-lg"
          >
            Watch Live
          </Link>
        </div>

        <p className="mt-6 text-sm sm:text-base opacity-80 italic">
          “Come as you are – All are welcome in Christ.”
        </p>
      </div>
    </section>
  );
}
