"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from "../../context/ThemeContext";
// Added Edit2, Save, X icons
import { Shield, ArrowLeft, Plus, Check, Trash2, Lock, AlertTriangle, Edit2, Save, X } from "lucide-react";
import { motion } from "framer-motion";

// Roles that cannot be deleted OR renamed to prevent system breakage
const PROTECTED_ROLES = ["super_admin", "admin", "pastor"];

export default function RoleManager() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [newRoleName, setNewRoleName] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ NEW STATE FOR RENAMING
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

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

  // Reset rename state when switching roles
  useEffect(() => {
    setIsRenaming(false);
    if(selectedRole) setRenameValue(selectedRole.name);
  }, [selectedRole]);

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

  // ✅ NEW FUNCTION: RENAME ROLE
  const handleRenameSubmit = async () => {
    if (!renameValue || renameValue === selectedRole.name) {
        setIsRenaming(false);
        return;
    }

    // Optimistic Update
    const updatedRoles = roles.map(r => r.id === selectedRole.id ? { ...r, name: renameValue } : r);
    setRoles(updatedRoles);
    setSelectedRole({ ...selectedRole, name: renameValue });
    setIsRenaming(false);

    try {
        const token = localStorage.getItem("token");
        await fetch(`${API_URL}/api/super-admin/roles/${selectedRole.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ name: renameValue }),
        });
    } catch (e) {
        console.error(e);
        fetchData(localStorage.getItem("token")); // Revert on error
    }
  };

  const updatePermissions = async (roleId, permissionName) => {
    // 1. Find the current role
    const role = roles.find((r) => r.id === roleId);
    
    // 2. check if permission exists
    const hasPermission = role.permissions.some((p) => p.name === permissionName);
    
    // 3. Create new list of permission names
    let newPermNames = role.permissions.map(p => p.name);
    
    if (hasPermission) {
      // Remove it
      newPermNames = newPermNames.filter((p) => p !== permissionName);
    } else {
      // Add it
      newPermNames.push(permissionName);
    }

    // 4. Format them back into objects { name: "..." } for the UI
    const newPermissionObjects = newPermNames.map(name => ({ name }));

    // 5. Update the MAIN list (for the sidebar counts)
    const updatedRoles = roles.map(r => 
        r.id === roleId ? { ...r, permissions: newPermissionObjects } : r
    );
    setRoles(updatedRoles);

    // ✅ CRITICAL FIX: Update 'selectedRole' so the checkmarks update instantly
    if (selectedRole && selectedRole.id === roleId) {
        setSelectedRole({ ...selectedRole, permissions: newPermissionObjects });
    }

    // 6. API Call
    const token = localStorage.getItem("token");
    try {
        await fetch(`${API_URL}/api/super-admin/roles/${roleId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ permissions: newPermNames }),
        });
    } catch (e) {
        console.error("Failed to update permissions", e);
        // Optional: Revert changes here if API fails
    }
  };

  const deleteRole = async (role) => {
    if (PROTECTED_ROLES.includes(role.name)) {
        alert("Action Denied: This is a System Critical Role.");
        return;
    }
    if(!confirm(`Delete role "${role.name}"? This cannot be undone.`)) return;
    
    const token = localStorage.getItem("token");
    await fetch(`${API_URL}/api/super-admin/roles/${role.id}`, {
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
                        {PROTECTED_ROLES.includes(role.name) ? (
                            <div className="flex items-center gap-2">
                                {role.name === 'super_admin' && <Lock size={14} className="opacity-70" />}
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${selectedRole?.id === role.id ? "bg-white/20" : "bg-amber-500/10 text-amber-500 border border-amber-500/20"}`}>
                                    System
                                </span>
                            </div>
                        ) : (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${selectedRole?.id === role.id ? "bg-white/20" : "bg-slate-200 dark:bg-slate-800"}`}>
                                {role.permissions.length}
                            </span>
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
                        <div className="flex-1">
                            <div className="flex items-center gap-3">
                                {/* ✅ RENAME LOGIC START */}
                                {isRenaming ? (
                                    <div className="flex items-center gap-2">
                                        <input 
                                            value={renameValue}
                                            onChange={(e) => setRenameValue(e.target.value)}
                                            className={`px-2 py-1 rounded border text-lg font-bold outline-none focus:ring-2 focus:ring-indigo-500 ${inputClass}`}
                                            autoFocus
                                        />
                                        <button onClick={handleRenameSubmit} className="p-1.5 bg-green-500/20 text-green-500 rounded hover:bg-green-500/30">
                                            <Save size={18} />
                                        </button>
                                        <button onClick={() => setIsRenaming(false)} className="p-1.5 bg-red-500/20 text-red-500 rounded hover:bg-red-500/30">
                                            <X size={18} />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <h2 className="text-xl font-bold capitalize">{selectedRole.name.replace('_', ' ')}</h2>
                                        
                                        {/* RENAME BUTTON: Only show if NOT protected */}
                                        {!PROTECTED_ROLES.includes(selectedRole.name) && (
                                            <button 
                                                onClick={() => setIsRenaming(true)}
                                                className={`p-1.5 rounded transition ${isDark ? "hover:bg-slate-800 text-slate-500" : "hover:bg-slate-100 text-slate-400"}`}
                                                title="Rename Role"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                        )}
                                    </>
                                )}
                                {/* ✅ RENAME LOGIC END */}

                                {PROTECTED_ROLES.includes(selectedRole.name) && (
                                    <span className="text-xs font-bold text-amber-500 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                                        System Protected
                                    </span>
                                )}
                            </div>
                            <p className="text-sm opacity-60 mt-1">Manage permissions for this role</p>
                        </div>
                        
                        {!PROTECTED_ROLES.includes(selectedRole.name) && (
                            <button onClick={() => deleteRole(selectedRole)} className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition ml-4">
                                <Trash2 size={18} />
                            </button>
                        )}
                    </div>

                    {selectedRole.name === 'super_admin' ? (
                        <div className="bg-amber-500/10 text-amber-500 p-8 rounded-xl border border-amber-500/20 text-center">
                            <Shield size={48} className="mx-auto mb-4" />
                            <h3 className="text-lg font-bold mb-2">Full System Access</h3>
                            <p className="text-sm opacity-80 max-w-md mx-auto">
                                The Super Admin role bypasses all permission checks. It automatically has access to every feature in the system and cannot be modified.
                            </p>
                        </div>
                    ) : (
                        <>
                            {PROTECTED_ROLES.includes(selectedRole.name) && (
                                <div className="mb-6 flex items-start gap-3 p-4 rounded-lg bg-blue-500/5 border border-blue-500/20 text-blue-500">
                                    <AlertTriangle size={20} className="shrink-0 mt-0.5" />
                                    <div className="text-sm">
                                        <span className="font-bold block mb-1">Core Role Warning</span>
                                        This is a default system role. You can edit its permissions, but you cannot rename or delete it.
                                    </div>
                                </div>
                            )}

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
                        </>
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