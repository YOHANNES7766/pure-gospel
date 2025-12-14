"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Activity, RefreshCw, ShieldAlert, User, 
  Settings, CheckCircle, FileText 
} from "lucide-react";

/* === UTILITY: Relative Time === */
function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/* === CONFIG: Icons & Colors === */
const getActionConfig = (description) => {
  const desc = description.toLowerCase();
  
  if (desc.includes("deleted") || desc.includes("revoked") || desc.includes("force")) {
    return { color: "red", icon: <ShieldAlert size={14} strokeWidth={2.5} /> };
  }
  if (desc.includes("updated") || desc.includes("permissions") || desc.includes("renamed")) {
    return { color: "blue", icon: <Settings size={14} strokeWidth={2.5} /> };
  }
  if (desc.includes("created")) {
    return { color: "emerald", icon: <CheckCircle size={14} strokeWidth={2.5} /> };
  }
  return { color: "slate", icon: <Activity size={14} strokeWidth={2.5} /> };
};

export default function AuditLogViewer({ isDark }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); 

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  // Theme Constants
  const cardClass = isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100";
  const textMain = isDark ? "text-slate-200" : "text-slate-800";
  const textSub = isDark ? "text-slate-500" : "text-slate-500";

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/super-admin/audit-logs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if(res.ok) {
        setLogs(await res.json());
      }
    } catch(e) { console.error(e); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchLogs(); }, []);

  /* === HELPER: Get Clean Target Name === */
  const getTargetInfo = (log) => {
    // If we have the subject object loaded (thanks to Backend update)
    if (log.subject) {
        // If it's a User
        if (log.subject.fullName) return { name: log.subject.fullName, type: "User" };
        // If it's a Role
        if (log.subject.name) return { name: log.subject.name.replace(/_/g, ' '), type: "Role" };
    }
    
    // Fallback if Subject was deleted or missing
    const type = log.subject_type ? log.subject_type.split('\\').pop() : "System";
    return { name: `ID #${log.subject_id}`, type: type };
  };

  /* === FILTER LOGIC === */
  const filteredLogs = logs.filter(log => {
    if (filter === "security") return log.description.toLowerCase().match(/revoked|reset|deleted/);
    if (filter === "user") return log.subject_type?.includes("User");
    return true;
  });

  return (
    <div className={`p-6 rounded-2xl border shadow-sm transition-colors duration-300 ${cardClass}`}>
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h3 className={`font-bold text-lg flex items-center gap-2 ${textMain}`}>
            <Activity className="text-indigo-500" /> Recent Activity
        </h3>
        
        <div className="flex gap-2">
            {["all", "security", "user"].map((f) => (
                <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                        filter === f 
                        ? "bg-indigo-600 text-white" 
                        : isDark ? "bg-slate-800 text-slate-400 hover:bg-slate-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                >
                    {f === "user" ? "Users" : f}
                </button>
            ))}
             <button onClick={fetchLogs} className={`p-1.5 rounded-full ml-2 ${isDark ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}>
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
        </div>
      </div>

      {/* FEED LIST */}
      <div className="space-y-0 relative">
        {/* Connector Line */}
        <div className={`absolute left-[19px] top-4 bottom-4 w-px ${isDark ? "bg-slate-800" : "bg-slate-200"}`}></div>

        {filteredLogs.map((log) => {
            const config = getActionConfig(log.description);
            const { name, type } = getTargetInfo(log);

            // Clean up description (remove "for role: finance" since we show it in the badge)
            // This is a simple visual cleanup
            let cleanDesc = log.description.split(':')[0]; 
            if(cleanDesc.length > 50) cleanDesc = log.description; // fallback if complex string

            return (
                <div key={log.id} className="relative pl-10 py-3 group">
                    
                    {/* ICON DOT */}
                    <div className={`absolute left-2 top-4 w-6 h-6 rounded-full flex items-center justify-center border-[3px] z-10 transition-colors ${
                        isDark 
                        ? `bg-slate-900 border-slate-800 text-${config.color}-400` 
                        : `bg-white border-white shadow-sm text-${config.color}-500`
                    }`}>
                        {config.icon}
                    </div>

                    {/* LOG CONTENT */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        
                        <div className="flex items-center gap-2 flex-wrap">
                            {/* Actor */}
                            <span className={`text-sm font-bold ${textMain}`}>
                                {log.causer?.fullName || "System"}
                            </span>
                            
                            {/* Action Text */}
                            <span className={`text-sm ${textSub}`}>
                                {cleanDesc.toLowerCase()}
                            </span>

                            {/* TARGET BADGE (The main fix) */}
                            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold border ${
                                isDark 
                                ? "bg-slate-800 border-slate-700 text-slate-300" 
                                : "bg-slate-100 border-slate-200 text-slate-700"
                            }`}>
                                {type === 'User' ? <User size={10} /> : <FileText size={10} />}
                                <span className="uppercase tracking-wider">{name}</span>
                            </div>
                        </div>

                        {/* Relative Time */}
                        <div className={`text-xs font-medium whitespace-nowrap ${textSub}`}>
                            {timeAgo(log.created_at)}
                        </div>
                    </div>
                </div>
            );
        })}

        {!loading && filteredLogs.length === 0 && (
            <div className="text-center py-8 opacity-50 text-sm">No activity found.</div>
        )}
      </div>

      {/* FOOTER */}
      <div className="mt-6 pt-4 border-t border-dashed border-slate-200 dark:border-slate-800 text-center">
        <Link href="/super-admin/audit-logs" className="text-xs font-bold text-indigo-500 hover:text-indigo-400 uppercase tracking-widest">
            View Full History
        </Link>
      </div>
    </div>
  );
}