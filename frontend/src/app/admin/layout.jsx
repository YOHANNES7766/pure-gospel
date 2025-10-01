"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const token = localStorage.getItem("token");

    if (!user || !token || user.role?.toLowerCase() !== "admin") {
      router.replace("/login");
    } else {
      setAuthorized(true);
    }

    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold text-gray-700">
        Checking admin access...
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-green-700 to-green-900 text-white shadow-lg">
        <div className="p-6 text-2xl font-bold text-center tracking-wide border-b border-green-600">
          ⛪ Pure Gospel
        </div>
        <nav className="mt-6 space-y-2 px-4">
          {[
            "Dashboard",
            "Announcements",
            "Attendance",
            "Members",
            "Visitors",
            "Events",
            "Contributions",
            "Payments",
            "Expenses",
            "Accounting",
            "Meetings",
            "Books",
          ].map((item, idx) => (
            <a
              key={idx}
              href="#"
              className="block py-2.5 px-3 rounded-lg font-medium hover:bg-green-600 hover:translate-x-1 transition-all duration-200"
            >
              {item}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1">
        {/* Header */}
        <header className="flex justify-between items-center bg-white shadow-md px-8 py-4 sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-green-800">Admin Dashboard</h1>
          <button
            onClick={() => {
              localStorage.clear();
              router.push("/login");
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
          >
            Logout
          </button>
        </header>

        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
