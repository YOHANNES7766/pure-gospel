"use client";
import { useEffect, useState } from "react";
import { getVisitors, deleteVisitor } from "../utils/api";
import { useRouter } from "next/navigation";

export default function VisitorTable({ filters }) {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const data = await getVisitors(filters);
        setVisitors(data);
      } catch (err) {
        console.error("Failed to load visitors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVisitors();
  }, [filters]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this visitor?")) return;
    await deleteVisitor(id);
    setVisitors((prev) => prev.filter((v) => v.id !== id));
  };

  if (loading) return <p>Loading visitors...</p>;

  if (visitors.length === 0)
    return <p className="text-center text-gray-500">No visitors found.</p>;

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="bg-gray-100 text-gray-800 uppercase">
          <tr>
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Name & Contact</th>
            <th className="px-4 py-2">Purpose</th>
            <th className="px-4 py-2">Visit Date</th>
            <th className="px-4 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {visitors.map((v, i) => (
            <tr key={v.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{i + 1}</td>
              <td className="px-4 py-2">
                <p className="font-medium">{v.name}</p>
                <p className="text-xs text-gray-500">{v.phone || v.email}</p>
              </td>
              <td className="px-4 py-2">{v.purpose || "-"}</td>
              <td className="px-4 py-2">
                {new Date(v.visit_date).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 text-right">
                <button
                  onClick={() => router.push(`/admin/visitors/${v.id}/edit`)}
                  className="text-blue-600 hover:underline mr-3"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(v.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
