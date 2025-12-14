"use client";

import { useState, useEffect } from "react";
import { Clock, Activity, RefreshCw, User } from "lucide-react";

export default function AuditLogViewer({ isDark }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/super-admin/audit-logs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if(res.ok) setLogs(await res.json());
    } catch(e) { console.error(e); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchLogs(); }, []);

  return (
    <div className={`p-6 rounded-2xl border shadow-sm transition-colors duration-300 ${
        isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
    }`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className={`font-bold text-lg flex items-center gap-2 ${isDark ? "text-slate-100" : "text-slate-800"}`}>
            <Activity className="text-indigo-500" /> Recent System Activity
        </h3>
        <button 
            onClick={fetchLogs} 
            className={`p-2 rounded-full transition ${
                isDark ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"
            }`}
        >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className={`overflow-hidden rounded-xl border ${isDark ? "border-slate-800" : "border-slate-200"}`}>
        <table className="w-full text-sm text-left">
            <thead className={`uppercase text-xs ${isDark ? "bg-slate-800 text-slate-400" : "bg-slate-50 text-slate-500"}`}>
                <tr>
                    <th className="px-4 py-3">Admin / User</th>
                    <th className="px-4 py-3">Action</th>
                    <th className="px-4 py-3">Target</th>
                    <th className="px-4 py-3">Time</th>
                </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? "divide-slate-800" : "divide-slate-100"}`}>
                {logs.map(log => (
                    <tr key={log.id} className={`transition ${isDark ? "hover:bg-slate-800/50" : "hover:bg-slate-50"}`}>
                        <td className={`px-4 py-3 font-medium flex items-center gap-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                            <User size={14} className="opacity-50" />
                            {log.causer?.fullName || "System"}
                        </td>
                        <td className="px-4 py-3">
                            <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
                                isDark ? "bg-indigo-900/30 text-indigo-300" : "bg-indigo-50 text-indigo-700"
                            }`}>
                                {log.description}
                            </span>
                        </td>
                        <td className={`px-4 py-3 opacity-70 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                            {log.subject_type?.split('\\').pop()} #{log.subject_id}
                        </td>
                        <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                            <div className="flex items-center gap-1">
                                <Clock size={12} /> 
                                {new Date(log.created_at).toLocaleDateString()}
                            </div>
                        </td>
                    </tr>
                ))}
                {logs.length === 0 && !loading && (
                    <tr><td colSpan="4" className="text-center py-6 opacity-50">No logs found</td></tr>
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
}