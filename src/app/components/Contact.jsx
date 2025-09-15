import React from "react";

const Contact = () => {
  return (
    <section
      id="contact"
      className="py-20 px-6 bg-gradient-to-b from-white to-blue-50"
    >
      <div className="max-w-6xl mx-auto text-center">
        {/* Heading */}
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Contact Us</h2>
        <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
          “For where two or three gather in my name, there am I with them.”{" "}
          <br />
          <span className="italic text-gray-500">– Matthew 18:20</span>
        </p>

        {/* Contact Form */}
        <form className="grid gap-6 max-w-3xl mx-auto text-left bg-white p-8 rounded-2xl shadow-xl">
          {/* Name */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Name</label>
            <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
              <span className="ml-3 text-gray-400">👤</span>
              <input
                type="text"
                className="w-full p-3 rounded-lg outline-none text-gray-800 placeholder-gray-400"
                placeholder="Your Name"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Email</label>
            <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
              <span className="ml-3 text-gray-400">📧</span>
              <input
                type="email"
                className="w-full p-3 rounded-lg outline-none text-gray-800 placeholder-gray-400"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Message
            </label>
            <div className="flex items-start border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
              <span className="ml-3 mt-3 text-gray-400">💬</span>
              <textarea
                rows="5"
                className="w-full p-3 rounded-lg outline-none text-gray-800 placeholder-gray-400"
                placeholder="Write your prayer request or message..."
                required
              ></textarea>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow hover:bg-blue-700 transition-colors"
          >
            Send Message
          </button>
        </form>

        {/* Church Info */}
        <div className="mt-12 text-gray-700">
          <p className="font-semibold">📍 Address: 123 Church Street, Your City</p>
          <p>📞 Phone: +251 912 345 678</p>
          <p>✉️ Email: contact@yourchurch.org</p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
