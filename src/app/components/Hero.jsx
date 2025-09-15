import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative w-full h-screen flex items-center justify-center text-center bg-gray-900 bg-[url('/church-bg.jpeg')] bg-cover bg-center scroll-mt-16"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

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
            href="/about"
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
