"use client";

import { useState } from "react";
import { LogOut, KeyRound } from "lucide-react";

export default function UserSecurityControls({ userId, userName, isDark }) {
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  const handleRevoke = async () => {
    if (!confirm(`Are you sure you want to log ${userName} out of ALL devices?`)) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/super-admin/users/${userId}/revoke-sessions`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) alert("User logged out successfully.");
      else alert("Action failed.");
    } catch (e) { console.error(e); } 
    finally { setLoading(false); }
  };

  const handleReset = async () => {
    const pass = prompt(`Enter NEW password for ${userName}:`);
    if (!pass) return;
    if (pass.length < 8) return alert("Password must be at least 8 characters");
    
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/super-admin/users/${userId}/force-reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ password: pass })
      });
      if (res.ok) alert("Password reset successful. User logged out.");
      else alert("Action failed.");
    } catch (e) { console.error(e); } 
    finally { setLoading(false); }
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <button 
        onClick={handleRevoke} 
        disabled={loading} 
        title="Revoke All Sessions"
        className={`p-2 rounded-lg border transition-all active:scale-95 ${
            isDark 
            ? "border-orange-900/50 text-orange-400 hover:bg-orange-900/20" 
            : "border-orange-200 text-orange-600 hover:bg-orange-50"
        }`}
      >
        <LogOut size={16} />
      </button>

      <button 
        onClick={handleReset} 
        disabled={loading} 
        title="Force Password Reset"
        className={`p-2 rounded-lg border transition-all active:scale-95 ${
            isDark 
            ? "border-red-900/50 text-red-400 hover:bg-red-900/20" 
            : "border-red-200 text-red-600 hover:bg-red-50"
        }`}
      >
        <KeyRound size={16} />
      </button>
    </div>
  );
}