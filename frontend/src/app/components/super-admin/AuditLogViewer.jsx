"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Activity, RefreshCw, ShieldAlert, User, 
  Settings, CheckCircle, FileText, ChevronLeft, ChevronRight 
} from "lucide-react";
// 1. Import Framer Motion for smooth animations
import { motion, AnimatePresence } from "framer-motion";

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
  // We keep 'isFetching' separate so we don't clear the data while pagination loads
  const [isFetching, setIsFetching] = useState(false); 
  const [filter, setFilter] = useState("all"); 

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); 
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  // Theme Constants
  const cardClass = isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100";
  const textMain = isDark ? "text-slate-200" : "text-slate-800";
  const textSub = isDark ? "text-slate-500" : "text-slate-500";

  const fetchLogs = async (background = false) => {
    if (!background) setLoading(true); // Initial load
    setIsFetching(true); // Pagination load

    try {
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams({
          page: currentPage,
          limit: itemsPerPage,
      }).toString();

      const res = await fetch(`${API_URL}/api/super-admin/audit-logs?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if(res.ok) {
        const data = await res.json();
        setLogs(data.data); 
        setTotalPages(data.last_page);
        setTotalItems(data.total);
      }
    } catch(e) { console.error(e); } 
    finally { 
        setLoading(false);
        setIsFetching(false);
    }
  };

  useEffect(() => { fetchLogs(logs.length > 0); }, [currentPage, itemsPerPage]); // Pass true to fetchLogs to avoid full layout reset

  /* === HELPER: Get Clean Target Name === */
  const getTargetInfo = (log) => {
    if (log.subject) {
        if (log.subject.fullName) return { name: log.subject.fullName, type: "User" };
        if (log.subject.name) return { name: log.subject.name.replace(/_/g, ' '), type: "Role" };
    }
    const type = log.subject_type ? log.subject_type.split('\\').pop() : "System";
    return { name: `ID #${log.subject_id}`, type: type };
  };

  /* === CLIENT FILTERING === */
  const filteredLogs = logs.filter(log => {
    if (filter === "security") return log.description.toLowerCase().match(/revoked|reset|deleted/);
    if (filter === "user") return log.subject_type?.includes("User");
    return true;
  });

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Pagination Logic
  const pageNumbers = [];
  for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
    pageNumbers.push(i);
  }
  if (currentPage - 1 > 1) pageNumbers.unshift(1, '...');
  if (currentPage + 1 < totalPages) pageNumbers.push('...', totalPages);


  return (
    <div className={`p-6 rounded-2xl border shadow-sm transition-colors duration-300 relative ${cardClass}`}>
      
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
             <button onClick={() => fetchLogs(false)} className={`p-1.5 rounded-full ml-2 ${isDark ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}>
                <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
            </button>
        </div>
      </div>

      {/* FEED LIST CONTAINER */}
      <div className="space-y-0 relative min-h-[300px]">
        {/* Connector Line */}
        <div className={`absolute left-[19px] top-4 bottom-4 w-px ${isDark ? "bg-slate-800" : "bg-slate-200"}`}></div>

        {/* LOADING OVERLAY (Smooths the transition) */}
        {isFetching && (
            <div className={`absolute inset-0 z-20 backdrop-blur-[2px] flex items-center justify-center rounded-xl ${isDark ? "bg-slate-900/10" : "bg-white/10"}`}>
                {/* Optional: Add a subtle loading indicator here if needed, but backdrop blur is usually enough */}
            </div>
        )}

        {loading ? (
            <div className={`text-center py-20 ${textSub} flex flex-col items-center justify-center`}>
                <RefreshCw size={24} className="animate-spin mb-3 opacity-50" />
                <span className="opacity-50 text-xs uppercase tracking-widest">Loading Logs...</span>
            </div>
        ) : filteredLogs.length === 0 ? (
            <div className="text-center py-8 opacity-50 text-sm">No activity found.</div>
        ) : (
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentPage} // Triggers animation when page changes
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                >
                    {filteredLogs.map((log) => {
                        const config = getActionConfig(log.description);
                        const { name, type } = getTargetInfo(log);
                        let cleanDesc = log.description.split(':')[0]; 
                        if(cleanDesc.length > 50) cleanDesc = log.description; 

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
                                        <span className={`text-sm font-bold ${textMain}`}>
                                            {log.causer?.fullName || "System"}
                                        </span>
                                        <span className={`text-sm ${textSub}`}>
                                            {cleanDesc.toLowerCase()}
                                        </span>
                                        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold border ${
                                            isDark ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-slate-100 border-slate-200 text-slate-700"
                                        }`}>
                                            {type === 'User' ? <User size={10} /> : <FileText size={10} />}
                                            <span className="uppercase tracking-wider">{name}</span>
                                        </div>
                                    </div>

                                    <div className={`text-xs font-medium whitespace-nowrap ${textSub}`}>
                                        {timeAgo(log.created_at)}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </motion.div>
            </AnimatePresence>
        )}
      </div>

      {/* PAGINATION CONTROLS */}
      {!loading && totalItems > 0 && (
        <div className="mt-6 pt-4 border-t border-dashed border-slate-200 dark:border-slate-800 flex justify-between items-center text-sm">
            <span className={textSub}>
                {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
            </span>

            <div className="flex items-center gap-1">
                <button 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    disabled={currentPage === 1 || isFetching}
                    className={`p-2 rounded-lg transition active:scale-95 ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"} ${(currentPage === 1 || isFetching) ? "opacity-30 cursor-not-allowed" : ""}`}
                >
                    <ChevronLeft size={16} />
                </button>

                {pageNumbers.map((page, index) => (
                    typeof page === 'number' ? (
                        <button 
                            key={index}
                            onClick={() => handlePageChange(page)}
                            disabled={isFetching}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition active:scale-95 ${
                                currentPage === page 
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" 
                                : isDark ? "bg-slate-800 text-slate-400 hover:bg-slate-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                        >
                            {page}
                        </button>
                    ) : (
                        <span key={index} className="px-2 py-1 text-xs font-bold text-slate-400">...</span>
                    )
                ))}

                <button 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    disabled={currentPage === totalPages || isFetching}
                    className={`p-2 rounded-lg transition active:scale-95 ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"} ${(currentPage === totalPages || isFetching) ? "opacity-30 cursor-not-allowed" : ""}`}
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
      )}

      {/* FOOTER */}
      <div className="mt-4 text-center">
        <Link href="/super-admin/audit-logs" className="text-xs font-bold text-indigo-500 hover:text-indigo-400 uppercase tracking-widest">
            View Full History
        </Link>
      </div>
    </div>
  );
}