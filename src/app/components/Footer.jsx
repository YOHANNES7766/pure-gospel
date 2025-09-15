import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-10 text-center md:text-left">
        {/* Church Info */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-4">Pure Gospel</h3>
          <p className="text-gray-400 mb-4">
            A Christ-centered community sharing God’s Word with love and truth.
          </p>
          <p className="italic text-sm text-gray-500">
            “The Lord bless you and keep you.” – Numbers 6:24
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/about" className="hover:text-blue-400 transition">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/ministries" className="hover:text-blue-400 transition">
                Ministries
              </Link>
            </li>
            <li>
              <Link href="/events" className="hover:text-blue-400 transition">
                Events
              </Link>
            </li>
            <li>
              <Link href="/sermons" className="hover:text-blue-400 transition">
                Sermons
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Get in Touch</h4>
          <p className="mb-2">✉️ info@puregospel.org</p>
          <p className="mb-2">📞 +123 456 7890</p>
          <p>📍 123 Church Street, City</p>

          {/* Social Media */}
          <div className="flex justify-center md:justify-start gap-4 mt-4">
            <a
              href="#"
              className="p-2 rounded-full bg-gray-800 hover:bg-blue-600 transition transform hover:scale-110"
              aria-label="Facebook"
            >
              📘
            </a>
            <a
              href="#"
              className="p-2 rounded-full bg-gray-800 hover:bg-red-600 transition transform hover:scale-110"
              aria-label="YouTube"
            >
              ▶️
            </a>
            <a
              href="#"
              className="p-2 rounded-full bg-gray-800 hover:bg-pink-500 transition transform hover:scale-110"
              aria-label="Instagram"
            >
              📸
            </a>
            <a
              href="#"
              className="p-2 rounded-full bg-gray-800 hover:bg-green-500 transition transform hover:scale-110"
              aria-label="WhatsApp"
            >
              💬
            </a>
          </div>
        </div>

        {/* Newsletter / Prayer Request */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Stay Connected</h4>
          <p className="text-gray-400 mb-3">
            Get updates, devotionals, and event reminders:
          </p>
          <form className="flex items-center bg-gray-800 rounded-lg overflow-hidden">
            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-2 bg-gray-800 text-gray-200 placeholder-gray-400 outline-none"
            />
            <button
              type="submit"
              className="bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700 transition"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-12 border-t border-gray-700 pt-6 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} Pure Gospel. All rights reserved. <br />
        <span className="text-gray-500 italic">
          Built with love, faith, and community ✝️
        </span>
      </div>
    </footer>
  );
};

export default Footer;
