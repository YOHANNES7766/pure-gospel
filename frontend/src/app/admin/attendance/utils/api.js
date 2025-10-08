// src/utils/api.js
"use client";

import { redirect } from "next/navigation";

export async function apiFetch(url, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(url, { ...options, headers });

  // ✅ If token expired or invalid
  if (res.status === 401) {
    console.warn("⚠️ Unauthorized: redirecting to login");

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect user to login page
    window.location.href = "/"; // adjust if your login is at `/login`
    return Promise.reject(new Error("Unauthorized - redirecting to login"));
  }

  return res;
}
