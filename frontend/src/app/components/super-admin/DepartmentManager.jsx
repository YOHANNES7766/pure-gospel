"use client";
import { useState, useEffect } from "react";
import { Briefcase, Plus, Trash2, Users } from "lucide-react";

export default function DepartmentManager({ isDark }) {
  const [departments, setDepartments] = useState([]);
  const [newDept, setNewDept] = useState("");
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  const fetchDepts = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/api/super-admin/departments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setDepartments(await res.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchDepts(); }, []);

  const createDept = async () => {
    if (!newDept) return;
    
    const token = localStorage.getItem("token");
    
    try {
      const res = await fetch(`${API_URL}/api/super-admin/departments`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json", 
            Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ name: newDept })
      });

      const data = await res.json(); // Get the response message

      if (res.ok) {
        setNewDept(""); // Clear input
        fetchDepts();   // Refresh list
      } else {
        // 🛑 This will tell you exactly what is wrong
        console.error("Creation Failed:", data);
        alert(`Failed: ${data.message || "Unknown error"}`);
      }
    } catch (e) { 
        console.error("Network Error:", e);
        alert("Network error. Check console.");
    }
  };

  const deleteDept = async (id) => {
    if(!confirm("Delete this department?")) return;
    const token = localStorage.getItem("token");
    await fetch(`${API_URL}/api/super-admin/departments/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchDepts();
  };

  const cardClass = isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100";
  const inputClass = isDark ? "bg-slate-950 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800";

  return (
    <div className={`p-6 rounded-2xl border shadow-sm h-full ${cardClass}`}>
      <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${isDark ? "text-slate-100" : "text-slate-800"}`}>
        <Briefcase className="text-indigo-500" /> Departments
      </h3>

      <div className="flex gap-2 mb-4">
        <input 
          value={newDept}
          onChange={(e) => setNewDept(e.target.value)}
          placeholder="New Dept Name"
          className={`flex-1 px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${inputClass}`}
        />
        <button onClick={createDept} className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition">
            <Plus size={20} />
        </button>
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {departments.map(dept => (
          <div key={dept.id} className={`flex justify-between items-center p-3 rounded-lg border transition ${isDark ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100"}`}>
            <div>
              <span className={`font-medium text-sm ${isDark ? "text-slate-200" : "text-slate-700"}`}>{dept.name}</span>
              <div className="flex items-center gap-1 text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                <Users size={10} /> {dept.users_count || 0} Members
              </div>
            </div>
            <button onClick={() => deleteDept(dept.id)} className="text-red-500 hover:bg-red-500/10 p-1.5 rounded transition">
                <Trash2 size={16} />
            </button>
          </div>
        ))}
        {departments.length === 0 && <p className="text-center text-xs opacity-50 py-4">No departments yet.</p>}
      </div>
    </div>
  );
}