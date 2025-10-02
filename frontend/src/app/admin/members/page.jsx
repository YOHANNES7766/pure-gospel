"use client";
import MemberStats from "./components/MemberStats";
import MemberTable from "./components/MemberTable";
import Link from "next/link";

export default function MembersPage() {
  return (
    <div className="space-y-8">
      {/* Stats */}
      <MemberStats />

      {/* Actions */}
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search by name, phone, or ID..."
          className="border px-4 py-2 rounded w-1/3"
        />
        <div className="space-x-3">
          <button className="bg-purple-600 text-white px-4 py-2 rounded">
            Import Members
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Export PDF
          </button>
          <Link
            href="/admin/members/new"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Add New Member
          </Link>
        </div>
      </div>

      {/* Members Table */}
      <MemberTable />
    </div>
  );
}
