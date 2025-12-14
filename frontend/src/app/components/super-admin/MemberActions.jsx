"use client";
import { useState } from "react";
import { Check, X, Users, Briefcase } from "lucide-react";

export default function MemberActions({ user, refreshData, departments, isDark }) {
  const [loading, setLoading] = useState(false);
  const [showDeptModal, setShowDeptModal] = useState(false);
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  // --- ACTIONS ---

  const handleStatusToggle = async () => {
    // Determine action based on current status
    const endpoint = user.member_status === 'Suspended' ? 'suspend' : 'suspend'; 
    // Note: The backend logic toggles it, so we call 'suspend' endpoint for both suspend/restore actions 
    // based on your previous controller logic.
    
    if(!confirm(`Are you sure you want to change access for ${user.fullName}?`)) return;

    setLoading(true);
    const token = localStorage.getItem("token");
    try {
        await fetch(`${API_URL}/api/super-admin/users/${user.id}/suspend`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` }
        });
        refreshData();
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const approveUser = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    await fetch(`${API_URL}/api/super-admin/users/${user.id}/approve`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
    });
    setLoading(false);
    refreshData();
  };

  const assignDept = async (deptId) => {
    const token = localStorage.getItem("token");
    await fetch(`${API_URL}/api/super-admin/departments/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ user_id: user.id, department_id: deptId })
    });
    setShowDeptModal(false);
    refreshData();
  };

  // --- UI HELPERS ---
  const isSuspended = user.member_status === 'Suspended';
  const isPending = user.member_status === 'Pending' || user.member_status === 'no';
  const isActive = user.member_status === 'Active' || user.member_status === 'yes';

  return (
    <>
        <div className="flex items-center justify-center gap-3">
        
        {/* 1. APPROVE BUTTON (Only if Pending) */}
        {isPending ? (
            <button 
                onClick={approveUser} 
                disabled={loading}
                className="flex items-center gap-1 px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full shadow-md hover:bg-emerald-600 transition"
            >
                <Check size={14} /> Approve
            </button>
        ) : (
            <>
                {/* 2. TEAM ASSIGNMENT BUTTON */}
                <button 
                    onClick={() => setShowDeptModal(true)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition ${
                        isDark 
                        ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700" 
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                    title="Manage Team"
                >
                    <Briefcase size={14} className="text-indigo-500" />
                    <span>Team</span>
                </button>

                {/* 3. STATUS TOGGLE (Active/Suspended) */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleStatusToggle}
                        disabled={loading}
                        className={`relative w-10 h-5 rounded-full transition-colors duration-300 focus:outline-none ${
                            isActive ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
                        }`}
                        title={isActive ? "Account Active (Click to Suspend)" : "Account Suspended (Click to Restore)"}
                    >
                        <span className={`absolute left-1 top-1 bg-white w-3 h-3 rounded-full shadow-sm transform transition-transform duration-300 ${
                            isActive ? "translate-x-5" : "translate-x-0"
                        }`} />
                    </button>
                </div>
            </>
        )}
        </div>

        {/* --- DEPARTMENT MODAL (Pop-up) --- */}
        {showDeptModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className={`w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden ${isDark ? "bg-slate-900 border border-slate-700" : "bg-white"}`}>
                    
                    {/* Modal Header */}
                    <div className="px-6 py-4 border-b border-dashed border-slate-200 dark:border-slate-700 flex justify-between items-center">
                        <h3 className={`font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Assign to Team</h3>
                        <button onClick={() => setShowDeptModal(false)} className="text-slate-400 hover:text-red-500">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Modal Body */}
                    <div className="p-6">
                        <p className="text-sm text-slate-500 mb-4">Select a department for <strong>{user.fullName}</strong>:</p>
                        
                        <div className="grid grid-cols-2 gap-3">
                            {departments.map((dept) => (
                                <button
                                    key={dept.id}
                                    onClick={() => assignDept(dept.id)}
                                    className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${
                                        isDark 
                                        ? "border-slate-700 hover:bg-indigo-600 hover:border-indigo-600 text-slate-300 hover:text-white" 
                                        : "border-slate-200 hover:bg-indigo-50 hover:border-indigo-200 text-slate-600 hover:text-indigo-700"
                                    }`}
                                >
                                    <Users size={16} />
                                    {dept.name}
                                </button>
                            ))}
                        </div>

                        {departments.length === 0 && (
                            <div className="text-center py-4 text-slate-400 text-sm">No departments created yet.</div>
                        )}
                    </div>
                </div>
            </div>
        )}
    </>
  );
}