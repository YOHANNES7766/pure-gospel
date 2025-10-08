"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function MembersPage() {
  const [stats, setStats] = useState([]);
  const [members, setMembers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [groupFilter, setGroupFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  const api = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // ✅ Fetch stats
  useEffect(() => {
    if (!token) return;
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
        setStats([]);
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
        setFiltered(data);
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
      setFiltered((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error("❌ Delete failed", err);
      alert("Failed to delete member");
    }
  };

  // ✅ Filter logic
  useEffect(() => {
    let temp = members;

    // Search
    if (search.trim() !== "") {
      temp = temp.filter((m) =>
        [m.full_name, m.phone, m.member_id]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    // Status
    if (statusFilter !== "All") {
      temp = temp.filter((m) => m.status === statusFilter);
    }

    // Group
    if (groupFilter !== "All") {
      temp = temp.filter((m) => m.church_group === groupFilter);
    }

    setFiltered(temp);
  }, [search, statusFilter, groupFilter, members]);

  // ✅ Extract unique groups
  const groups = ["All", ...new Set(members.map((m) => m.church_group || "Unassigned"))];

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      {/* 📊 Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {statsLoading ? (
          <div className="col-span-6 text-gray-500 text-center py-4">Loading stats...</div>
        ) : stats.length === 0 ? (
          <div className="col-span-6 text-gray-500 text-center py-4">No stats found</div>
        ) : (
          stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white shadow-sm p-4 rounded-lg text-center border border-gray-200 hover:shadow-md transition"
            >
              <div className="text-2xl font-bold text-gray-700">{stat.value}</div>
              <p className="mt-1 font-medium text-gray-600">{stat.label}</p>
            </div>
          ))
        )}
      </div>

      {/* 🧰 Filters + Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
          {/* 🔍 Search */}
          <div className="flex items-center w-full md:w-80 bg-white border border-gray-300 rounded-md shadow-sm">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, phone, or ID..."
              className="px-4 py-2 w-full focus:outline-none rounded-md"
            />
            <button className="bg-gray-700 text-white px-4 py-2 rounded-r-md">Search</button>
          </div>

          {/* 📋 Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 bg-white focus:ring-2 focus:ring-gray-300"
          >
            <option>All</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>

          {/* 🏷️ Group Filter */}
          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 bg-white focus:ring-2 focus:ring-gray-300"
          >
            {groups.map((g, i) => (
              <option key={i} value={g}>
                {g === "Unassigned" ? "No Group" : g}
              </option>
            ))}
          </select>
        </div>

        {/* ➕ Buttons */}
        <div className="flex flex-wrap gap-2 justify-end">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition">
            Import Members
          </button>
          <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md transition">
            Export to PDF
          </button>
          <Link
            href="/admin/members/new"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md inline-block transition"
          >
            Add New Member
          </Link>
        </div>
      </div>

      {/* 👥 Members Table */}
      <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200">
        {loading ? (
          <p className="text-center text-gray-500 py-6">Loading members...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No members found</p>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-200 text-gray-800 uppercase text-xs tracking-wider border-b">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Name</th>
                <th className="px-4 py-3 text-left font-semibold">Phone</th>
                <th className="px-4 py-3 text-left font-semibold">Group</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100 text-gray-800">
              {filtered.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium">{m.full_name}</td>
                  <td className="px-4 py-3">{m.phone}</td>
                  <td className="px-4 py-3">{m.church_group || "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        m.status === "Active"
                          ? "bg-green-100 text-green-700 border border-green-300"
                          : "bg-red-100 text-red-700 border border-red-300"
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex flex-wrap gap-2">
                    <Link
                      href={`/admin/members/${m.id}`}
                      className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium transition"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/members/${m.id}/edit`}
                      className="px-3 py-1 rounded-md bg-amber-100 text-amber-700 hover:bg-amber-200 font-medium transition"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="px-3 py-1 rounded-md bg-red-100 text-red-700 hover:bg-red-200 font-medium transition"
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
