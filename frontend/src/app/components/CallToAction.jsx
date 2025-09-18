import React from "react";

const CallToAction = () => {
  return (
    <section
      id="donate" // ✅ changed from get-involved
      className="py-20 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 text-white scroll-mt-24"
    >
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Get Involved With Pure Gospel
        </h2>
        <p className="text-lg md:text-xl mb-12 max-w-3xl mx-auto text-blue-100">
          Your support helps us spread the message of hope, love, and truth.
          Whether through giving, volunteering, or joining our mission, you can
          make a difference today.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <a
            href="#donate"
            className="bg-white text-blue-700 font-semibold py-3 px-8 rounded-xl shadow hover:bg-blue-100 transition-colors"
          >
            Donate Now
          </a>
          <a
            href="#volunteer"
            className="bg-yellow-400 text-blue-900 font-semibold py-3 px-8 rounded-xl shadow hover:bg-yellow-300 transition-colors"
          >
            Volunteer
          </a>
          <a
            href="#contact"
            className="bg-green-500 text-white font-semibold py-3 px-8 rounded-xl shadow hover:bg-green-600 transition-colors"
          >
            Join Us
          </a>
        </div>

        <div className="mt-16 bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg max-w-3xl mx-auto">
          <h3 className="text-2xl font-semibold mb-4">
            🌍 Together We Can Impact Lives
          </h3>
          <p className="text-blue-100 mb-6">
            Be part of a growing community that lives out the gospel and brings
            transformation to our world.
          </p>
          <a
            href="#contact"
            className="inline-block bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-xl transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
