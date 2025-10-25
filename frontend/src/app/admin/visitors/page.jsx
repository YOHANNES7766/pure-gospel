"use client";
import { useState, useEffect } from "react";
import VisitorTable from "./components/VisitorTable";
import VisitorFilter from "./components/VisitorFilter";
import VisitorStats from "./components/VisitorStats";
import Link from "next/link";
import { getVisitors } from "./utils/api";

export default function VisitorsPage() {
  const [filters, setFilters] = useState({});
  const [stats, setStats] = useState({ total: 0, week: 0, month: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getVisitors();
      const total = data.length;
      const now = new Date();
      const week = data.filter((v) => {
        const d = new Date(v.visit_date);
        const diff = (now - d) / (1000 * 60 * 60 * 24);
        return diff <= 7;
      }).length;
      const month = data.filter(
        (v) => new Date(v.visit_date).getMonth() === now.getMonth()
      ).length;
      setStats({ total, week, month });
    };
    fetchStats();
  }, []);

  return (
    <div className="p-6 space-y-5">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Visitors</h2>
        <Link
          href="/admin/visitors/new"
          className="bg-green-600 text-white px-4 py-2 rounded-md"
        >
          + Add Visitor
        </Link>
      </div>

      <VisitorFilter onFilter={setFilters} />
      <VisitorStats stats={stats} />
      <VisitorTable filters={filters} />
    </div>
  );
}
