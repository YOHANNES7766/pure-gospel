"use client";
import { motion } from "framer-motion";
import { HeartIcon, GlobeAltIcon } from "@heroicons/react/24/outline";

export default function About() {
  return (
    <section id="about" className="py-20 px-6 bg-gray-50 text-center scroll-mt-16">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6"
        >
          About Us
        </motion.h2>

        {/* Intro Text */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-lg text-gray-600 mb-12"
        >
          At <span className="font-semibold text-blue-600">Pure Gospel</span>, we
          are a Christ-centered community committed to living out the message of
          Jesus with love and truth. We welcome all people, from every
          background, into fellowship with Christ and one another.
        </motion.p>

        {/* Mission & Vision */}
        <div className="grid gap-8 sm:grid-cols-2">
          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="p-6 bg-white shadow-md rounded-lg transition"
          >
            <HeartIcon className="h-10 w-10 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-3 text-blue-600">
              Our Mission
            </h3>
            <p className="text-gray-600">
              To proclaim the pure gospel of Jesus Christ and disciple believers
              to grow in faith, love, and service to the world.
            </p>
          </motion.div>

          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="p-6 bg-white shadow-md rounded-lg transition"
          >
            <GlobeAltIcon className="h-10 w-10 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-3 text-blue-600">
              Our Vision
            </h3>
            <p className="text-gray-600">
              To see lives transformed by the power of God’s Word and to build a
              strong, Spirit-filled church that impacts our community and the
              nations.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
