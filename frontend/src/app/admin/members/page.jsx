"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function MembersPage() {
  const [stats, setStats] = useState([]);
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  const api = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // ✅ Fetch stats
  useEffect(() => {
    if (!token) return; // Don't fetch if token is missing
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const res = await fetch(`${api}/api/members/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("❌ Stats fetch error", err);
        setStats([]); // fallback
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, [api, token]);

  // ✅ Fetch members
  useEffect(() => {
    if (!token) return;
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${api}/api/members`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch members");
        const data = await res.json();
        setMembers(data);
      } catch (err) {
        console.error("❌ Members fetch error", err);
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, [api, token]);

  // ✅ Delete member
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this member?")) return;
    try {
      const res = await fetch(`${api}/api/members/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete member");

      setMembers((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error("❌ Delete failed", err);
      alert("Failed to delete member");
    }
  };

  // ✅ Filter members
  const filtered = members.filter((m) =>
    [m.full_name, m.phone, m.member_id].join(" ").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      {/* 📊 Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {statsLoading ? (
          <div className="col-span-6 text-gray-400 text-center">Loading stats...</div>
        ) : stats.length === 0 ? (
          <div className="col-span-6 text-gray-400 text-center">No stats found</div>
        ) : (
          stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white shadow p-4 rounded text-center border hover:shadow-lg transition"
            >
              <div className="text-xl font-bold text-blue-600">{stat.value}</div>
              <p className="mt-1 font-medium text-gray-700">{stat.label}</p>
            </div>
          ))
        )}
      </div>

      {/* 🧰 Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, phone, or ID..."
          className="border px-4 py-2 rounded w-full md:w-1/3"
        />
        <div className="space-x-3">
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">
            Import Members
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            Export PDF
          </button>
          <Link
            href="/admin/members/new"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded inline-block"
          >
            Add New Member
          </Link>
        </div>
      </div>

      {/* 👥 Members Table */}
      <div className="bg-white shadow rounded-lg p-4 overflow-x-auto">
        {loading ? (
          <p className="text-center text-gray-500 py-6">Loading members...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No members found</p>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Group</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="p-3 font-semibold">{m.full_name}</td>
                  <td className="p-3">{m.phone}</td>
                  <td className="p-3">{m.church_group}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium text-white ${
                        m.status === "Active" ? "bg-green-600" : "bg-red-600"
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td className="p-3 space-x-2">
                    <Link
                      href={`/admin/members/${m.id}`}
                      className="px-3 py-1 border rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/members/${m.id}/edit`}
                      className="px-3 py-1 border rounded bg-orange-100 text-orange-700 hover:bg-orange-200"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="px-3 py-1 border rounded bg-red-100 text-red-700 hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
