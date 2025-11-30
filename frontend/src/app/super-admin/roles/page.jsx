"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from "../../context/ThemeContext";
import { Shield, ArrowLeft, Plus, Check, Trash2, Lock } from "lucide-react";
import { motion } from "framer-motion";

export default function RoleManager() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [newRoleName, setNewRoleName] = useState("");
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  // Styles matching your Dashboard
  const cardClass = isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100";
  const inputClass = isDark ? "bg-slate-950 border-slate-700 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-800";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchData(token);
  }, []);

  const fetchData = async (token) => {
    try {
      const [rolesRes, permsRes] = await Promise.all([
        fetch(`${API_URL}/api/super-admin/roles`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/api/super-admin/permissions`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      
      if(rolesRes.ok && permsRes.ok) {
        setRoles(await rolesRes.json());
        setPermissions(await permsRes.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createRole = async () => {
    if (!newRoleName) return;
    const token = localStorage.getItem("token");
    
    try {
      const res = await fetch(`${API_URL}/api/super-admin/roles`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: newRoleName, permissions: [] }),
      });
      
      if (res.ok) {
        setNewRoleName("");
        fetchData(token);
      }
    } catch(e) { console.error(e) }
  };

  const updatePermissions = async (roleId, permissionName) => {
    // Optimistic Update
    const role = roles.find((r) => r.id === roleId);
    const hasPermission = role.permissions.some((p) => p.name === permissionName);
    
    let newPerms = role.permissions.map(p => p.name);
    if (hasPermission) {
      newPerms = newPerms.filter((p) => p !== permissionName);
    } else {
      newPerms.push(permissionName);
    }

    const updatedRoles = roles.map(r => 
        r.id === roleId ? { ...r, permissions: newPerms.map(name => ({ name })) } : r
    );
    setRoles(updatedRoles);

    // API Call
    const token = localStorage.getItem("token");
    await fetch(`${API_URL}/api/super-admin/roles/${roleId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ permissions: newPerms }),
    });
  };

  const deleteRole = async (id) => {
    if(!confirm("Are you sure? This action cannot be undone.")) return;
    const token = localStorage.getItem("token");
    await fetch(`${API_URL}/api/super-admin/roles/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
    });
    fetchData(token);
    setSelectedRole(null);
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans ${isDark ? "bg-slate-950 text-slate-200" : "bg-slate-50 text-slate-800"}`}>
      
      {/* HEADER */}
      <header className={`px-8 py-4 border-b ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-white/50"} backdrop-blur-xl sticky top-0 z-30`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Link href="/super-admin">
                    <button className={`p-2 rounded-full transition ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-200"}`}>
                        <ArrowLeft size={20} />
                    </button>
                </Link>
                <h1 className="text-xl font-bold flex items-center gap-2">
                    <Shield className="text-indigo-500" /> Role Manager
                </h1>
            </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT: ROLE LIST */}
        <div className={`p-6 rounded-2xl border shadow-sm ${cardClass}`}>
            <h2 className="font-bold mb-4">System Roles</h2>
            
            {/* Create Input */}
            <div className="flex gap-2 mb-6">
                <input 
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    placeholder="New Role (e.g. Media)" 
                    className={`flex-1 px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${inputClass}`}
                />
                <button onClick={createRole} className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg">
                    <Plus size={20} />
                </button>
            </div>

            <div className="space-y-2">
                {roles.map((role) => (
                    <motion.div 
                        whileHover={{ scale: 1.02 }}
                        key={role.id}
                        onClick={() => setSelectedRole(role)}
                        className={`p-3 rounded-xl cursor-pointer flex justify-between items-center transition-all border ${
                            selectedRole?.id === role.id 
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/30" 
                            : `${isDark ? "hover:bg-slate-800 border-transparent" : "hover:bg-slate-100 border-transparent"}`
                        }`}
                    >
                        <span className="capitalize font-medium">{role.name.replace('_', ' ')}</span>
                        {role.name !== 'super_admin' ? (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${selectedRole?.id === role.id ? "bg-white/20" : "bg-slate-200 dark:bg-slate-800"}`}>
                                {role.permissions.length}
                            </span>
                        ) : (
                            <Lock size={14} className="opacity-70" />
                        )}
                    </motion.div>
                ))}
            </div>
        </div>

        {/* RIGHT: PERMISSIONS */}
        <div className={`lg:col-span-2 p-6 rounded-2xl border shadow-sm ${cardClass}`}>
            {selectedRole ? (
                <>
                    <div className="flex justify-between items-start mb-6 border-b pb-4 border-dashed border-slate-700">
                        <div>
                            <h2 className="text-xl font-bold capitalize">{selectedRole.name.replace('_', ' ')}</h2>
                            <p className="text-sm opacity-60">Manage permissions for this role</p>
                        </div>
                        {selectedRole.name !== 'super_admin' && (
                            <button onClick={() => deleteRole(selectedRole.id)} className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition">
                                <Trash2 size={18} />
                            </button>
                        )}
                    </div>

                    {selectedRole.name === 'super_admin' ? (
                        <div className="bg-amber-500/10 text-amber-500 p-6 rounded-xl border border-amber-500/20 text-center">
                            <Shield size={40} className="mx-auto mb-2" />
                            <p className="font-bold">Full System Access</p>
                            <p className="text-sm opacity-80">Super Admins have all permissions by default. This cannot be changed.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {permissions.map((perm) => {
                                const isChecked = selectedRole.permissions.some(p => p.name === perm.name);
                                return (
                                    <div 
                                        key={perm.id}
                                        onClick={() => updatePermissions(selectedRole.id, perm.name)}
                                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                            isChecked 
                                            ? "bg-emerald-500/10 border-emerald-500/30" 
                                            : `${isDark ? "border-slate-800 hover:bg-slate-800" : "border-slate-100 hover:bg-slate-50"}`
                                        }`}
                                    >
                                        <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                                            isChecked ? "bg-emerald-500 text-white" : "bg-slate-300 dark:bg-slate-700"
                                        }`}>
                                            {isChecked && <Check size={12} strokeWidth={3} />}
                                        </div>
                                        <span className={`capitalize text-sm ${isChecked ? "text-emerald-500 font-medium" : "opacity-70"}`}>
                                            {perm.name.replace(/_/g, ' ')}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </>
            ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-30">
                    <Shield size={64} className="mb-4" />
                    <p className="text-lg">Select a role to configure</p>
                </div>
            )}
        </div>

      </main>
    </div>
  );
}