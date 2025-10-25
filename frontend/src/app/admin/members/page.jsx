"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch stats
  useEffect(() => {
    if (!token) return;
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const res = await fetch(`${api}/api/members/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Stats fetch error", err);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, [api, token]);

  // Fetch members
  useEffect(() => {
    if (!token) return;
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${api}/api/members`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        const data = await res.json();
        setMembers(data);
        setFiltered(data);
      } catch (err) {
        console.error("Members fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, [api, token]);

  // Filter logic
  useEffect(() => {
    let temp = members;
    if (search.trim() !== "") {
      temp = temp.filter((m) =>
        [m.full_name, m.phone, m.member_id]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }
    if (statusFilter !== "All") {
      temp = temp.filter((m) => m.status === statusFilter);
    }
    if (groupFilter !== "All") {
      temp = temp.filter((m) => m.church_group === groupFilter);
    }
    setFiltered(temp);
  }, [search, statusFilter, groupFilter, members]);

  // Delete member
  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      const res = await fetch(`${api}/api/members/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete member");
      setMembers((prev) => prev.filter((m) => m.id !== id));
      setFiltered((prev) => prev.filter((m) => m.id !== id));
      alert(`${name} has been deleted successfully.`);
    } catch (err) {
      console.error("Delete error", err);
      alert("Failed to delete member.");
    }
  };

  // Age calculator
  const calculateAge = (birthDate) => {
    if (!birthDate) return "—";
    const diff = Date.now() - new Date(birthDate).getTime();
    return Math.abs(new Date(diff).getUTCFullYear() - 1970);
  };

  // Export PDF — no html2canvas
  const handleExportPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Header
      const header = () => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("Pure Gospel Church — Members Report", 40, 40);
        doc.setFontSize(10);
        doc.text(`Generated on ${new Date().toLocaleString()}`, 40, 55);
        doc.line(40, 60, pageWidth - 40, 60);
      };

      // Footer
      const footer = (pageNum, totalPages) => {
        doc.setFontSize(9);
        doc.text(
          `Page ${pageNum} of ${totalPages}`,
          pageWidth - 80,
          pageHeight - 20
        );
      };

      header();

      // Add total members to the top of the PDF
      doc.setFontSize(11);
      doc.text(`Total Members: ${members.length}`, 40, 70);

      const tableData = filtered.map((m) => [
        m.full_name || "—",
        m.email || "—",
        m.phone || "—",
        m.member_id || "—",
        m.birth_date || "—",
        calculateAge(m.birth_date),
        m.gender || "—",
        m.address || "—",
        m.member_category || "—",
        m.church_group || "—",
        m.status || "—",
      ]);

      autoTable(doc, {
        startY: 90,
        head: [
          [
            "Name",
            "Email",
            "Phone",
            "ID",
            "Birth Date",
            "Age",
            "Gender",
            "Address",
            "Category",
            "Group",
            "Status",
          ],
        ],
        body: tableData,
        theme: "grid",
        headStyles: {
          fillColor: [67, 56, 202],
          textColor: 255,
          fontStyle: "bold",
        },
        styles: { fontSize: 9, cellPadding: 4 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        didDrawPage: (data) => {
          header();
          const pageNum = doc.internal.getNumberOfPages();
          const totalPages = doc.internal.getNumberOfPages();
          footer(pageNum, totalPages);
        },
      });

      doc.save("members_report.pdf");
    } catch (err) {
      console.error("❌ PDF Export Error:", err);
      alert("Failed to export members to PDF.");
    }
  };

  const groups = [
    "All",
    ...new Set(members.map((m) => m.church_group || "Unassigned")),
  ];

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      {/* Buttons */}
      <div className="flex flex-wrap justify-end gap-3 mb-6">
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition shadow-sm"
        >
          <i className="fa-solid fa-download"></i> Export to PDF
        </button>

        <Link
          href="/admin/members/new"
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition shadow-sm"
        >
          <i className="fa-solid fa-user-plus"></i> Add Member
        </Link>
      </div>

      {/* Stats (includes Total Members) */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {/* Total Members Card */}
        <div className="bg-white shadow-sm p-4 rounded-lg text-center border border-gray-200 hover:shadow-md transition">
          <div className="text-2xl font-bold text-gray-700">{members.length}</div>
          <p className="mt-1 font-medium text-gray-600">Total Members</p>
        </div>

        {statsLoading ? (
          <div className="col-span-5 text-gray-500 text-center py-4">
            Loading stats...
          </div>
        ) : stats.length === 0 ? (
          <div className="col-span-5 text-gray-500 text-center py-4">
            No stats found
          </div>
        ) : (
          stats.map((s, i) => (
            <div
              key={i}
              className="bg-white shadow-sm p-4 rounded-lg text-center border border-gray-200 hover:shadow-md transition"
            >
              <div className="text-2xl font-bold text-gray-700">{s.value}</div>
              <p className="mt-1 font-medium text-gray-600">{s.label}</p>
            </div>
          ))
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, phone, or ID..."
          className="px-4 py-2 border rounded-md shadow-sm focus:ring w-full md:w-80"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-md px-4 py-2 bg-white"
        >
          <option>All</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
        <select
          value={groupFilter}
          onChange={(e) => setGroupFilter(e.target.value)}
          className="border rounded-md px-4 py-2 bg-white"
        >
          {groups.map((g, i) => (
            <option key={i} value={g}>
              {g === "Unassigned" ? "No Group" : g}
            </option>
          ))}
        </select>
      </div>

      {/* Members Table */}
      <div className="bg-white shadow-md rounded-xl overflow-x-auto border border-gray-200">
        {loading ? (
          <p className="text-center text-gray-500 py-6">Loading members...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No members found</p>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-200 text-gray-800 uppercase text-xs tracking-wider border-b">
              <tr>
                {[
                  "Name",
                  "Email",
                  "Phone",
                  "Member ID",
                  "Birth Date",
                  "Age",
                  "Gender",
                  "Address",
                  "Category",
                  "Group",
                  "Status",
                  "Actions",
                ].map((header) => (
                  <th key={header} className="px-4 py-3 text-left font-semibold">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100 text-gray-800">
              {filtered.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium">{m.full_name}</td>
                  <td className="px-4 py-3">{m.email || "—"}</td>
                  <td className="px-4 py-3">{m.phone || "—"}</td>
                  <td className="px-4 py-3">{m.member_id || "—"}</td>
                  <td className="px-4 py-3">{m.birth_date || "—"}</td>
                  <td className="px-4 py-3">{calculateAge(m.birth_date)}</td>
                  <td className="px-4 py-3">{m.gender || "—"}</td>
                  <td className="px-4 py-3">{m.address || "—"}</td>
                  <td className="px-4 py-3">{m.member_category || "—"}</td>
                  <td className="px-4 py-3">{m.church_group || "—"}</td>
                  <td className="px-4 py-3">{m.status}</td>

                  {/* Actions */}
                  <td className="px-4 py-3 flex flex-wrap gap-2">
                    <Link
                      href={`/admin/members/${m.id}`}
                      className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-md text-xs"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/members/${m.id}/edit`}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-xs"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(m.id, m.full_name)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs"
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
