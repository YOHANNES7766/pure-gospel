// app/admin/members/page.jsx
"use client";
export const dynamic = "force-dynamic";

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Plus,
  Trash2,
  Eye,
  Edit3,
  Search,
  Users,
  UserCheck,
  UserX,
  X,
  Filter,
  Download,
} from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";
import jsPDF from "jspdf";
import { applyPlugin } from "jspdf-autotable";

applyPlugin(jsPDF);

export default function MembersPage() {
  const { theme } = useContext(ThemeContext);
  const [stats, setStats] = useState([]);
  const [members, setMembers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [groupFilter, setGroupFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const api = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  // Read token into state and listen for changes (fixes races where localStorage changes after render)
  const [token, setToken] = useState(null);
  useEffect(() => {
    const read = () => {
      const raw = localStorage.getItem("token");
      if (!raw) return setToken(null);
      // strip potential wrapping quotes saved by some storage helpers
      const t = raw.startsWith('"') && raw.endsWith('"') ? raw.slice(1, -1) : raw;
      setToken(t);
    };
    read();
    const onStorage = (e) => {
      if (e.key === "token") read();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // small helper: fetch with AbortController + timeout
  const fetchWithTimeout = async (url, opts = {}, ms = 15000) => {
    const externalSignal = opts.signal;
    const timeoutController = new AbortController();
    let externalAbortListener = null;

    if (externalSignal) {
      if (externalSignal.aborted) {
        timeoutController.abort();
      } else {
        externalAbortListener = () => timeoutController.abort();
        externalSignal.addEventListener("abort", externalAbortListener);
      }
    }

    const id = setTimeout(() => timeoutController.abort(), ms);
    try {
      const mergedOpts = { ...opts, signal: timeoutController.signal };
      const res = await fetch(url, mergedOpts);
      clearTimeout(id);
      return res;
    } catch (err) {
      clearTimeout(id);
      throw err;
    } finally {
      if (externalSignal && externalAbortListener)
        externalSignal.removeEventListener("abort", externalAbortListener);
    }
  };

  // Fetch stats
  useEffect(() => {
    if (!token) return;
    let mounted = true;
    const controller = new AbortController();

    const handle401 = () => {
      // clear token and force login — Chrome clients that have stale/invalid tokens will be redirected
      try {
        localStorage.removeItem("token");
      } catch (e) {}
      setToken(null);
      window.location.href = "/login";
    };

    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const res = await fetchWithTimeout(`${api}/api/members/stats`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${String(token || "")}`,
            Accept: "application/json",
            "Cache-Control": "no-cache",
          },
          cache: "no-store",
          credentials: "include",
          mode: "cors",
          signal: controller.signal,
        });

        if (res.status === 401) {
          handle401();
          return;
        }

        if (!res.ok) throw new Error(`Stats fetch failed: ${res.status}`);
        const data = await res.json();
        if (!mounted) return;
        setStats(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Stats fetch error", err);
      } finally {
        if (mounted) setStatsLoading(false);
      }
    };
    fetchStats();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [api, token]);

  // Fetch members
  useEffect(() => {
    if (!token) return;
    let mounted = true;
    const controller = new AbortController();

    const handle401 = () => {
      try {
        localStorage.removeItem("token");
      } catch (e) {}
      setToken(null);
      window.location.href = "/login";
    };

    const fetchMembers = async () => {
      try {
        setLoading(true);
        const res = await fetchWithTimeout(`${api}/api/members`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${String(token || "")}`,
            Accept: "application/json",
            "Cache-Control": "no-cache",
          },
          cache: "no-store",
          credentials: "include",
          mode: "cors",
          signal: controller.signal,
        });

        if (res.status === 401) {
          handle401();
          return;
        }

        if (!res.ok) {
          let errText = "";
          try {
            errText = await res.text();
          } catch {}
          throw new Error(`Members fetch failed: ${res.status} ${errText}`);
        }

        const data = await res.json();
        if (!mounted) return;
        setMembers(Array.isArray(data) ? data : []);
        setFiltered(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Members fetch error", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchMembers();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [api, token]);

  // Filters
  useEffect(() => {
    let temp = members;
    if (search.trim()) {
      temp = temp.filter((m) =>
        [m.full_name, m.phone, m.member_id]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }
    if (statusFilter !== "All") temp = temp.filter((m) => m.status === statusFilter);
    if (groupFilter !== "All") temp = temp.filter((m) => m.church_group === groupFilter);
    setFiltered(temp);
  }, [search, statusFilter, groupFilter, members]);

  // Delete
  const handleDelete = async (id, name) => {
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return;
    try {
      const res = await fetch(`${api}/api/members/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      setMembers((prev) => prev.filter((m) => m.id !== id));
      setFiltered((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      alert("Failed to delete member.");
    }
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return "—";
    const diff = Date.now() - new Date(birthDate).getTime();
    return Math.abs(new Date(diff).getUTCFullYear() - 1970);
  };

  const exportToPDF = () => {
    if (filtered.length === 0) {
      alert("No members to export.");
      return;
    }

    const doc = new jsPDF();
    const tableColumn = ["Ordinal number", "Name", "Email", "Phone", "ID", "Age", "Gender", "Group", "Status"];
    const tableRows = filtered.map((m, i) => [
      i + 1,
      m.full_name,
      m.email || "—",
      m.phone || "—",
      m.member_id || "—",
      calculateAge(m.birth_date),
      m.gender || "—",
      m.church_group || "—",
      m.status,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [41, 128, 185] },
    });

    doc.text("Church Members List", 14, 15);
    doc.save("church_members.pdf");
  };

  const groups = ["All", ...new Set(members.map((m) => m.church_group || "Unassigned"))];

  return (
    <div className={`p-4 sm:p-6 lg:p-8 ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"} min-h-screen`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
      >
        <h1 className={`text-2xl sm:text-3xl font-bold flex items-center gap-3`}>
          <Users className="text-indigo-600 dark:text-indigo-400" size={32} />
          Church Members
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            href="/admin/members/new"
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-5 py-3 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Plus size={18} /> Add Member
          </Link>
          <button
            onClick={exportToPDF}
            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-5 py-3 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Download size={18} /> Export PDF
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`border p-4 rounded-2xl shadow-md hover:shadow-lg transition-all ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} col-span-1`}
        >
          <div className="flex flex-col items-center">
            <Users className="text-indigo-600 dark:text-indigo-400 mb-2" size={24} />
            <div className={`text-2xl font-bold`}>{members.length}</div>
            <p className={`text-xs sm:text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Total Members</p>
          </div>
        </motion.div>

        {statsLoading ? (
          <div className={`col-span-full flex items-center justify-center py-6 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
            <Loader2 className="animate-spin mr-2" size={20} /> Loading stats...
          </div>
        ) : stats.length === 0 ? (
          <div className={`col-span-full text-center py-6 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>No stats available</div>
        ) : (
          stats.map((s, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className={`border p-4 rounded-2xl shadow-md hover:shadow-lg transition-all ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} col-span-1`}
            >
              <div className="flex flex-col items-center">
                {i % 2 === 0 ? (
                  <UserCheck className="text-green-600 dark:text-green-400 mb-2" size={24} />
                ) : (
                  <UserX className="text-red-600 dark:text-red-400 mb-2" size={24} />
                )}
                <div className={`text-2xl font-bold`}>{s.value}</div>
                <p className={`text-xs sm:text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{s.label}</p>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`p-4 sm:p-6 rounded-2xl shadow-md border mb-6 ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`} size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, phone, or ID..."
              className={`w-full pl-10 pr-10 py-3 border rounded-full text-sm focus:outline-none focus:ring-2 transition-all shadow-sm ${theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-200 focus:ring-indigo-400 focus:border-indigo-400" : "bg-white border-gray-200 text-gray-800 focus:ring-indigo-500 focus:border-indigo-500"}`}
            />
            <AnimatePresence>
              {search && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  onClick={() => setSearch("")}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${theme === "dark" ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"}`}
                >
                  <X size={16} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`md:hidden flex items-center gap-2 px-4 py-3 border rounded-full text-sm font-medium transition shadow-sm ${theme === "dark" ? "bg-gray-700 border-gray-600 hover:bg-gray-600" : "bg-white border-gray-200 hover:bg-gray-50"}`}
          >
            <Filter size={16} /> Filters
          </button>

          {/* Desktop Filters */}
          <div className="hidden md:flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`px-4 py-3 border rounded-full text-sm focus:outline-none focus:ring-2 shadow-sm ${theme === "dark" ? "bg-gray-700 border-gray-600 focus:ring-indigo-400" : "bg-white border-gray-200 focus:ring-indigo-500"}`}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <select
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
              className={`px-4 py-3 border rounded-full text-sm focus:outline-none focus:ring-2 shadow-sm ${theme === "dark" ? "bg-gray-700 border-gray-600 focus:ring-indigo-400" : "bg-white border-gray-200 focus:ring-indigo-500"}`}
            >
              {groups.map((g) => (
                <option key={g} value={g}>
                  {g === "Unassigned" ? "No Group" : g}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Mobile Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 space-y-4 overflow-hidden"
            >
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`w-full px-4 py-3 border rounded-full text-sm shadow-sm ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200"}`}
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <select
                value={groupFilter}
                onChange={(e) => setGroupFilter(e.target.value)}
                className={`w-full px-4 py-3 border rounded-full text-sm shadow-sm ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200"}`}
              >
                {groups.map((g) => (
                  <option key={g} value={g}>
                    {g === "Unassigned" ? "No Group" : g}
                  </option>
                ))}
              </select>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Data */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={`rounded-2xl shadow-md border overflow-hidden ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
      >
        {loading ? (
          <div className={`flex items-center justify-center py-12 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
            <Loader2 className="animate-spin mr-3" size={24} />
            <span className="text-lg">Loading members...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className={`text-center py-12 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
            <Users size={48} className={`mx-auto mb-3 ${theme === "dark" ? "text-gray-600" : "text-gray-300"}`} />
            <p className="text-lg">No members found</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead className={`${theme === "dark" ? "bg-gray-700" : "bg-indigo-50"}`}>
                  <tr>
                    {["Ordinal number", "Name", "Email", "Phone", "ID", "Age", "Gender", "Group", "Status", "Actions"].map((h) => (
                      <th
                        key={h}
                        className={`border px-4 py-3 text-left font-semibold uppercase tracking-wider text-xs ${theme === "dark" ? "border-gray-600 text-gray-300" : "border-gray-200 text-gray-700"}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((m, i) => (
                    <motion.tr
                      key={m.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className={`${i % 2 === 0 ? (theme === "dark" ? "bg-gray-800" : "bg-white") : (theme === "dark" ? "bg-gray-700" : "bg-gray-50")} hover:${theme === "dark" ? "bg-gray-600" : "bg-indigo-50"} transition-colors`}
                    >
                      <td className={`border px-4 py-3 ${theme === "dark" ? "border-gray-600 text-gray-400" : "border-gray-200 text-gray-600"}`}>{i + 1}</td>
                      <td className={`border px-4 py-3 font-medium ${theme === "dark" ? "border-gray-600 text-gray-200" : "border-gray-200 text-gray-900"}`}>{m.full_name}</td>
                      <td className={`border px-4 py-3 ${theme === "dark" ? "border-gray-600 text-gray-400" : "border-gray-200 text-gray-600"}`}>{m.email || "—"}</td>
                      <td className={`border px-4 py-3 ${theme === "dark" ? "border-gray-600 text-gray-400" : "border-gray-200 text-gray-600"}`}>{m.phone || "—"}</td>
                      <td className={`border px-4 py-3 font-mono text-xs ${theme === "dark" ? "border-gray-600 text-gray-400" : "border-gray-200 text-gray-600"}`}>{m.member_id || "—"}</td>
                      <td className={`border px-4 py-3 ${theme === "dark" ? "border-gray-600 text-gray-400" : "border-gray-200 text-gray-600"}`}>{calculateAge(m.birth_date)}</td>
                      <td className={`border px-4 py-3 ${theme === "dark" ? "border-gray-600 text-gray-400" : "border-gray-200 text-gray-600"}`}>{m.gender || "—"}</td>
                      <td className={`border px-4 py-3 ${theme === "dark" ? "border-gray-600 text-gray-400" : "border-gray-200 text-gray-600"}`}>{m.church_group || "—"}</td>
                      <td className={`border px-4 py-3 ${theme === "dark" ? "border-gray-600" : "border-gray-200"}`}>
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            m.status === "Active"
                              ? (theme === "dark" ? "bg-green-800 text-green-100" : "bg-green-100 text-green-800")
                              : (theme === "dark" ? "bg-red-800 text-red-100" : "bg-red-100 text-red-800")
                          }`}
                        >
                          {m.status}
                        </span>
                      </td>
                      <td className={`border px-4 py-3 ${theme === "dark" ? "border-gray-600" : "border-gray-200"}`}>
                        <div className="flex gap-2">
                          <Link
                            href={`/admin/members/${m.id}`}
                            className="p-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full transition shadow-sm hover:shadow-md"
                          >
                            <Eye size={14} />
                          </Link>
                          <Link
                            href={`/admin/members/${m.id}/edit`}
                            className="p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-full transition shadow-sm hover:shadow-md"
                          >
                            <Edit3 size={14} />
                          </Link>
                          <button
                            onClick={() => handleDelete(m.id, m.full_name)}
                            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition shadow-sm hover:shadow-md"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className={`md:hidden divide-y ${theme === "dark" ? "divide-gray-700" : "divide-gray-200"}`}>
              {filtered.map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`p-4 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className={`font-semibold text-base`}>#{i + 1} {m.full_name}</h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        m.status === "Active"
                          ? (theme === "dark" ? "bg-green-800 text-green-100" : "bg-green-100 text-green-800")
                          : (theme === "dark" ? "bg-red-800 text-red-100" : "bg-red-100 text-red-800")
                      }`}
                    >
                      {m.status}
                    </span>
                  </div>
                  <div className={`grid grid-cols-1 gap-2 text-sm mb-3 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    <div className="flex justify-between">
                      <span className="font-semibold">Phone:</span> <span>{m.phone || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">ID:</span> <span className="font-mono">{m.member_id || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Age:</span> <span>{calculateAge(m.birth_date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Gender:</span> <span>{m.gender || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Group:</span> <span>{m.church_group || "—"}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/members/${m.id}`}
                      className="flex-1 bg-indigo-600 text-white py-2 rounded-full text-center text-sm font-medium hover:bg-indigo-700 transition shadow-sm"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/members/${m.id}/edit`}
                      className="flex-1 bg-amber-500 text-white py-2 rounded-full text-center text-sm font-medium hover:bg-amber-600 transition shadow-sm"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(m.id, m.full_name)}
                      className="flex-1 bg-red-600 text-white py-2 rounded-full text-center text-sm font-medium hover:bg-red-700 transition shadow-sm"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}