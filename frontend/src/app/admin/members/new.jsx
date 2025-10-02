"use client";
import MemberForm from "./components/MemberForm";

export default function NewMemberPage() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Member</h1>
      <MemberForm />
    </div>
  );
}
