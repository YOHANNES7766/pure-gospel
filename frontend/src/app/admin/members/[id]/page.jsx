"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";

export default function MemberInfoPage() {
  const router = useRouter();
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const res = await fetch(`${API_URL}/api/members/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          mode: "cors",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to load member info");
        const data = await res.json();
        setMember(data);
      } catch (err) {
        console.error("❌ Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchMember();
  }, [id, router]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-600 text-lg">
        <Loader2 className="animate-spin w-6 h-6 mr-2" /> Loading member info...
      </div>
    );

  if (!member)
    return (
      <div className="p-8 text-center text-red-500">
        Member not found or unable to load data.
      </div>
    );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => router.push("/admin/members")}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={18} className="mr-2" /> Back to Members
          </button>

          <button
            onClick={() => router.push(`/admin/members/${id}/edit`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Edit Member
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {member.full_name}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
          <Info label="Email" value={member.email} />
          <Info label="Phone" value={member.phone} />
          <Info label="Member ID" value={member.member_id} />
          <Info label="ID Number" value={member.id_number} />
          <Info label="Birth Date" value={member.birth_date} />
          <Info label="Address" value={member.address} />
          <Info label="Gender" value={member.gender} />
          <Info label="Status" value={member.status} />
          <Info label="Member Category" value={member.member_category} />
          <Info label="Church Group" value={member.church_group} />
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex flex-col border-b pb-2">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-base font-medium text-gray-800">
        {value || "—"}
      </span>
    </div>
  );
}
