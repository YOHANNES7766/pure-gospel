"use client";

import React from "react";
import { motion } from "framer-motion";

const blogs = [
  {
    id: 1,
    title: "The Power of Faith",
    author: "Pastor John Doe",
    date: "September 10, 2025",
    excerpt:
      "Faith is the foundation of our Christian walk. In this article, we explore how faith shapes our daily lives...",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Serving with Joy",
    author: "Pastor Jane Smith",
    date: "August 30, 2025",
    excerpt:
      "Service is at the heart of the gospel. Learn practical ways to serve others joyfully in your community.",
    image:
      "https://images.unsplash.com/photo-1508780709619-79562169bc64?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Prayer That Transforms",
    author: "Pastor Michael Lee",
    date: "August 15, 2025",
    excerpt:
      "Prayer is not just talking to God—it transforms us. Discover how prayer can change your perspective.",
    image:
      "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=800&q=80",
  },
];

const Blog = () => {
  return (
    <section
      id="blog"
      className="py-20 bg-gradient-to-b from-blue-50 via-white to-blue-50"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center text-blue-700 mb-14"
        >
          ✨ Latest From Pure Gospel Blog
        </motion.h2>

        {/* Blog Grid */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((post, i) => (
            <motion.article
              key={post.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-2 overflow-hidden flex flex-col"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Blog Image */}
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-52 object-cover"
              />

              {/* Blog Content */}
              <div className="flex-1 p-6 flex flex-col">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  ✍️ {post.author} | 📅 {post.date}
                </p>
                <p className="text-gray-600 line-clamp-3 mb-6">
                  {post.excerpt}
                </p>

                {/* CTA */}
                <div className="mt-auto">
                  <button className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition w-full sm:w-auto">
                    Read More →
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
