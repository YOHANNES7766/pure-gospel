// components/VisitorTable.jsx
"use client";

import { useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import { Eye, Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

export default function VisitorTable({ records, onDelete }) {
  const { theme } = useContext(ThemeContext);
  const router = useRouter();
  const isDark = theme === "dark";

  const handleView = (id) => router.push(`/admin/visitors/${id}`);
  const handleEdit = (id) => router.push(`/admin/visitors/${id}/edit`);
  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this visitor?")) {
      onDelete(id);
    }
  };

  return (
    <div className={`border rounded-lg overflow-x-auto shadow-sm ${isDark ? "bg-gray-800" : "bg-white"}`}>
      <table className={`min-w-full text-sm ${isDark ? "text-gray-200" : "text-gray-800"}`}>
        <thead className={`${isDark ? "bg-gray-700" : "bg-gray-100"} border-b`}>
          <tr>
            {["#", "Name & Contact", "Purpose", "Visit Date", "Actions"].map((h) => (
              <th key={h} className="p-3 font-semibold border-r">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {records.length > 0 ? (
            records.map((r, i) => (
              <tr key={i} className={`border-t ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-50"}`}>
                <td className="p-3 border-r">{i + 1}</td>
                <td className="p-3 border-r">
                  <p className="font-medium">{r.name}</p>
                  <p className="text-xs text-gray-500">{r.contact}</p>
                </td>
                <td className="p-3 border-r">
                  <span className={`px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-400`}>
                    {r.purpose || "-"}
                  </span>
                </td>
                <td className="p-3 border-r">{r.date}</td>
                <td className="p-3 flex gap-2 justify-end">
                  <button onClick={() => handleView(r.id)} className="text-blue-500 hover:text-blue-700">
                    <Eye size={16} />
                  </button>
                  <button onClick={() => handleEdit(r.id)} className="text-orange-500 hover:text-orange-700">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDelete(r.id)} className="text-red-500 hover:text-red-700">
                    <Trash size={16} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="p-4 text-center text-gray-500">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="sm:hidden text-center text-xs p-2 text-gray-500">
        Swipe to see all columns
      </div>
    </div>
  );
}