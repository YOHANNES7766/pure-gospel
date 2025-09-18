"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const handleLinkClick = () => setIsOpen(false);

  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/pure.jpg" alt="Church Logo" width={32} height={32} />
            <span className="font-bold text-xl text-blue-700 dark:text-blue-400">
              Pure Gospel
            </span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-6 items-center">
            <a href="#hero" onClick={handleLinkClick} className="hover:text-blue-600 dark:hover:text-blue-400">Home</a>
            <a href="#about" onClick={handleLinkClick} className="hover:text-blue-600 dark:hover:text-blue-400">About</a>
            <a href="#ministries" onClick={handleLinkClick} className="hover:text-blue-600 dark:hover:text-blue-400">Ministries</a>
            <a href="#events" onClick={handleLinkClick} className="hover:text-blue-600 dark:hover:text-blue-400">Events</a>
            <a href="#sermons" onClick={handleLinkClick} className="hover:text-blue-600 dark:hover:text-blue-400">Sermons</a>
            <a href="#contact" onClick={handleLinkClick} className="hover:text-blue-600 dark:hover:text-blue-400">Contact</a>

            {/* Login */}
            <button
              onClick={() => setIsLoginOpen(true)}
              className="px-4 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition"
            >
              Login
            </button>

            {/* Donate */}
            <a href="#donate" onClick={handleLinkClick} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
              Donate
            </a>
          </nav>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isOpen ? (
              <svg className="h-6 w-6 text-gray-800 dark:text-gray-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6 text-gray-800 dark:text-gray-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <nav className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="px-4 py-3 space-y-2 flex flex-col">
            <a href="#hero" onClick={handleLinkClick} className="hover:text-blue-600 dark:hover:text-blue-400">Home</a>
            <a href="#about" onClick={handleLinkClick} className="hover:text-blue-600 dark:hover:text-blue-400">About</a>
            <a href="#ministries" onClick={handleLinkClick} className="hover:text-blue-600 dark:hover:text-blue-400">Ministries</a>
            <a href="#events" onClick={handleLinkClick} className="hover:text-blue-600 dark:hover:text-blue-400">Events</a>
            <a href="#sermons" onClick={handleLinkClick} className="hover:text-blue-600 dark:hover:text-blue-400">Sermons</a>
            <a href="#contact" onClick={handleLinkClick} className="hover:text-blue-600 dark:hover:text-blue-400">Contact</a>

            {/* Login */}
            <button
              onClick={() => {
                setIsOpen(false);
                setIsLoginOpen(true);
              }}
              className="px-4 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition text-center"
            >
              Login
            </button>

            {/* Donate */}
            <a href="#donate" onClick={handleLinkClick} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition inline-block text-center">
              Donate
            </a>
          </div>
        </nav>
      )}

      {/* ✅ Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onOpenSignup={() => {
          setIsLoginOpen(false);
          setIsSignupOpen(true);
        }}
      />
      <SignupModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        onOpenLogin={() => {
          setIsSignupOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </header>
  );
}
