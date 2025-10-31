// components/MemberTable.jsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function MemberTable({ search }) {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const api = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        const token = localStorage.getItem("token");

        const res = await fetch(`${api}/api/members`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setMembers(data);
      } catch (err) {
        console.error("Failed to fetch members", err);
      }
    };

    fetchMembers();
  }, []);

  // Filter search
  const filtered = members.filter((m) =>
    [m.full_name, m.phone, m.member_id]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="bg-white shadow rounded-lg p-4">
      {filtered.length === 0 && (
        <p className="text-gray-500 text-center">No members found</p>
      )}
      {filtered.map((m, i) => (
        <div
          key={m.id}
          className="flex justify-between items-center border-b py-4"
        >
          <div className="mr-4">
            <p className="font-bold">#{i + 1}</p>
          </div>
          <div>
            <h3 className="font-semibold">
              {m.full_name} - {m.member_id || m.id}
            </h3>
            <p className="text-sm text-gray-500">{m.phone}</p>
          </div>
          <div className="flex gap-6 text-sm">
            <p>
              <span className="font-semibold">Group:</span> {m.church_group}
            </p>
            <p>
              <span className="font-semibold">Status:</span>{" "}
              <span
                className={`px-2 py-1 rounded text-white ${
                  m.status === "Active" ? "bg-green-600" : "bg-red-600"
                }`}
              >
                {m.status}
              </span>
            </p>
          </div>
          <div className="space-x-2">
            <Link
              href={`/admin/members/${m.id}`}
              className="px-3 py-1 border rounded bg-blue-100 text-blue-700"
            >
              View
            </Link>
            <Link
              href={`/admin/members/${m.id}/edit`}
              className="px-3 py-1 border rounded bg-orange-100 text-orange-700"
            >
              Edit
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}