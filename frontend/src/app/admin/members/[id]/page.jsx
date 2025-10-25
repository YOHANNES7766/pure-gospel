"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

// ✅ Helper to format fields consistently
function Info({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <span className="text-base text-gray-800">
        {value ? value : "—"}
      </span>
    </div>
  );
}

// ✅ Helper to calculate age from birth date
function calculateAge(birthDate) {
  if (!birthDate) return "—";
  const dob = new Date(birthDate);
  const diff = Date.now() - dob.getTime();
  const age = new Date(diff).getUTCFullYear() - 1970;
  return age > 0 ? `${age} years` : "—";
}

export default function MemberDetailPage() {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  const api = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // ✅ Fetch a single member by ID
  useEffect(() => {
    if (!id || !token) return;

    const fetchMember = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${api}/api/members/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch member details");
        const data = await res.json();
        setMember(data);
      } catch (err) {
        console.error("❌ Member fetch error:", err);
        setMember(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [id, api, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Loading member details...
      </div>
    );
  }

  if (!member) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Member not found.
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-8">
      {/* 🔙 Back button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">
          Member Details
        </h1>
        <Link
          href="/admin/members"
          className="text-indigo-600 hover:text-indigo-800 font-medium"
        >
          ← Back to Members
        </Link>
      </div>

      {/* 🧾 Member Details Card */}
      <div className="bg-white shadow-md rounded-xl border border-gray-200 p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
          <Info label="Full Name" value={member.full_name} />
          <Info label="Email" value={member.email} />
          <Info label="Phone" value={member.phone} />
          <Info label="Member ID" value={member.member_id} />
          <Info label="ID Number" value={member.id_number} />
          <Info label="Birth Date" value={member.birth_date} />
          <Info label="Age" value={calculateAge(member.birth_date)} />
          <Info label="Address" value={member.address} />
          <Info label="Gender" value={member.gender} />
          <Info label="Status" value={member.status} />
          <Info label="Member Category" value={member.member_category} />
          <Info label="Church Group" value={member.church_group} />
        </div>
      </div>

      {/* ✏️ Edit + Delete Buttons */}
      <div className="flex gap-3">
        <Link
          href={`/admin/members/${member.id}/edit`}
          className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md"
        >
          Edit Member
        </Link>

        <Link
          href="/admin/members"
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
        >
          Back
        </Link>
      </div>
    </div>
  );
}
