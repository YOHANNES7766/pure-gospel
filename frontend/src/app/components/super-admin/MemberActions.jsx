"use client";
import { useState } from "react";
import { Check, Ban, ShieldCheck, Briefcase } from "lucide-react";

export default function MemberActions({ user, refreshData, departments, isDark }) {
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  const action = async (endpoint) => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
        await fetch(`${API_URL}/api/super-admin/users/${user.id}/${endpoint}`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` }
        });
        refreshData();
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const assignDept = async (deptId) => {
    const token = localStorage.getItem("token");
    try {
        const res = await fetch(`${API_URL}/api/super-admin/departments/assign`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ user_id: user.id, department_id: deptId })
        });
        if(res.ok) {
            alert("Member assigned to department successfully");
            refreshData();
        }
    } catch(e) { console.error(e); }
  };

  // Determine status
  const isPending = user.member_status === 'Pending' || user.member_status === 'no';
  const isSuspended = user.member_status === 'Suspended';

  return (
    <div className="flex items-center justify-center gap-1">
      {/* 1. APPROVE (Only if Pending) */}
      {isPending && (
        <button 
          onClick={() => action('approve')} 
          disabled={loading}
          title="Approve Member"
          className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded border border-emerald-500/20 hover:bg-emerald-500/20 transition"
        >
          <Check size={14} />
        </button>
      )}

      {/* 2. SUSPEND / RESTORE */}
      <button 
        onClick={() => action('suspend')} 
        disabled={loading}
        title={isSuspended ? "Restore Account" : "Suspend Account"}
        className={`p-1.5 rounded border transition ${
            isSuspended 
            ? "bg-amber-500/10 border-amber-500/20 text-amber-500 hover:bg-amber-500/20" 
            : isDark ? "bg-slate-800 border-slate-700 text-slate-400 hover:text-red-400" : "bg-white border-slate-200 text-slate-400 hover:text-red-500"
        }`}
      >
        {isSuspended ? <ShieldCheck size={14} /> : <Ban size={14} />}
      </button>

      {/* 3. ASSIGN DEPARTMENT (Dropdown) */}
      <div className="relative group">
        <button className="p-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 rounded hover:bg-indigo-500/20 transition">
            <Briefcase size={14} />
        </button>
        
        {/* Hover Dropdown */}
        <div className={`absolute right-0 top-full mt-1 w-40 shadow-xl rounded-lg p-1 z-50 hidden group-hover:block border ${
            isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"
        }`}>
            <p className="text-[10px] uppercase text-slate-400 font-bold px-2 py-1 border-b border-dashed border-slate-700 mb-1">Assign Dept</p>
            {departments && departments.length > 0 ? departments.map(d => (
                <button 
                    key={d.id} 
                    onClick={() => assignDept(d.id)}
                    className={`w-full text-left text-xs px-2 py-1.5 rounded mb-0.5 transition ${
                        isDark ? "text-slate-300 hover:bg-slate-800" : "text-slate-700 hover:bg-slate-100"
                    }`}
                >
                    {d.name}
                </button>
            )) : (
                <div className="text-xs text-slate-500 px-2 py-1">No Depts</div>
            )}
        </div>
      </div>
    </div>
  );
}