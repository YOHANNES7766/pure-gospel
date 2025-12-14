"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from "../context/ThemeContext";
import {
  Users,
  Shield,
  Activity,
  LogOut,
  UserCheck,
  Search,
  Sun,
  Moon,
  Filter,
  Settings
} from "lucide-react";
import { motion } from "framer-motion";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  AreaChart,
  Area
} from "recharts";

// ✅ NEW IMPORTS: CORE SECURITY FEATURES
// Ensure these files exist in src/components/super-admin/

import UserSecurityControls from "../components/super-admin/UserSecurityControls";
import AuditLogViewer from "../components/super-admin/AuditLogViewer";
/* === SAMPLE DATA === */
const userGrowthData = [
  { month: "Jan", users: 50 },
  { month: "Feb", users: 80 },
  { month: "Mar", users: 120 },
  { month: "Apr", users: 150 },
  { month: "May", users: 200 },
  { month: "Jun", users: 240 },
];

const COLORS = ["#4ade80", "#60a5fa", "#a78bfa", "#facc15"];

export default function SuperAdminDashboard() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ total: 0, admins: 0, pastors: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // === THEME VARIABLES ===
  const isDark = theme === "dark";
  
  // Chart Colors
  const axisColor = isDark ? "#94a3b8" : "#64748b";
  const gridColor = isDark ? "#334155" : "#e2e8f0";
  const barColor = isDark ? "#818cf8" : "#6366f1";
  const tooltipBg = isDark ? "#1e293b" : "#ffffff";
  const tooltipText = isDark ? "#f8fafc" : "#0f172a";

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const userStored = JSON.parse(localStorage.getItem("user") || "{}");

      if (!token || userStored?.role !== "super_admin") {
        router.push("/login");
        return;
      }

      fetchUsers(token);
    }
  }, [router]);

  const fetchUsers = async (token) => {
    try {
      const res = await fetch(`${API_URL}/api/super-admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
        setStats({
          total: data.length,
          admins: data.filter((u) => u.role === "admin").length,
          pastors: data.filter((u) => u.role === "pastor").length,
          active: data.filter(
            (u) => u.member_status === "yes" || u.member_status === "Active"
          ).length,
        });
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    const token = localStorage.getItem("token");
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );

    try {
      await fetch(`${API_URL}/api/super-admin/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
    } catch (error) {
      console.error("Error updating role", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.mobile.includes(searchTerm)
  );

  const roleDistribution = [
    { name: "Users", value: users.filter((u) => u.role === "user").length },
    { name: "Admins", value: users.filter((u) => u.role === "admin").length },
    { name: "Pastors", value: users.filter((u) => u.role === "pastor").length },
    { name: "Super Admin", value: users.filter((u) => u.role === "super_admin").length },
  ];

  if (loading)
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${isDark ? "bg-slate-950 text-slate-300" : "bg-slate-50 text-slate-600"}`}>
        <div className="flex flex-col items-center gap-4">
          <Activity className="animate-spin h-10 w-10 text-indigo-500" /> 
          <span className="font-medium animate-pulse">Initializing Dashboard...</span>
        </div>
      </div>
    );

  return (
    <div className={`min-h-screen transition-colors duration-500 ease-in-out font-sans ${isDark ? "bg-slate-950 text-slate-200" : "bg-slate-50 text-slate-800"}`}>
      
      {/* === GLASS HEADER === */}
      <header className={`sticky top-0 z-30 px-4 sm:px-8 py-4 border-b backdrop-blur-xl transition-all duration-300 ${
        isDark ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-slate-200"
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
             <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-lg shadow-indigo-500/30">
                <Shield size={24} />
             </div>
             <div>
                <h1 className={`text-xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                  Super Admin
                </h1>
                <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  System Control Center
                </p>
             </div>
          </div>

          <div className="flex items-center gap-4">
            {/* === PREMIUM TOGGLE SWITCH === */}
            <div 
              onClick={toggleTheme}
              className={`relative w-16 h-8 rounded-full p-1 cursor-pointer transition-colors duration-500 shadow-inner ${
                isDark ? "bg-slate-800" : "bg-indigo-100"
              }`}
              title="Toggle Theme"
            >
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 700, damping: 30 }}
                className={`w-6 h-6 rounded-full shadow-md flex items-center justify-center ${
                  isDark ? "bg-slate-700 text-yellow-400 translate-x-8" : "bg-white text-orange-500 translate-x-0"
                }`}
              >
                {isDark ? <Moon size={14} fill="currentColor" /> : <Sun size={14} fill="currentColor" />}
              </motion.div>
            </div>

            {/* === MANAGE ROLES BUTTON === */}
            <Link href="/super-admin/roles">
                <button className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-sm border ${
                    isDark 
                    ? "bg-slate-800 border-slate-700 text-indigo-400 hover:bg-slate-700" 
                    : "bg-white border-slate-200 text-indigo-600 hover:bg-indigo-50"
                }`}>
                    <Settings size={16} />
                    <span className="hidden sm:inline">Manage Roles</span>
                </button>
            </Link>

            <div className={`h-8 w-px ${isDark ? "bg-slate-700" : "bg-slate-200"}`}></div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-sm hover:shadow-md active:scale-95 bg-gradient-to-r from-red-500 to-pink-600 text-white border-0"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* === MAIN CONTENT === */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        
        {/* === STATS GRID === */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Total Accounts"
            value={stats.total}
            subtitle="Registered Users"
            icon={<Users className="h-6 w-6" />}
            gradient="from-blue-500 to-indigo-600"
            delay={0}
          />
          <StatCard
            title="Administrators"
            value={stats.admins}
            subtitle="System Managers"
            icon={<Shield className="h-6 w-6" />}
            gradient="from-violet-500 to-fuchsia-600"
            delay={0.1}
          />
          <StatCard
            title="Pastors"
            value={stats.pastors}
            subtitle="Church Leaders"
            icon={<UserCheck className="h-6 w-6" />}
            gradient="from-emerald-500 to-teal-600"
            delay={0.2}
          />
          <StatCard
            title="System Health"
            value="100%"
            subtitle="Operational"
            icon={<Activity className="h-6 w-6" />}
            gradient="from-amber-500 to-orange-600"
            delay={0.3}
          />
        </div>

        {/* === CHARTS SECTION === */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ChartCard title="User Growth Analytics" isDark={isDark} className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={userGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={barColor} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={barColor} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis 
                  dataKey="month" 
                  stroke={axisColor} 
                  tick={{ fill: axisColor, fontSize: 12 }} 
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke={axisColor} 
                  tick={{ fill: axisColor, fontSize: 12 }} 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    borderColor: gridColor,
                    borderRadius: "12px",
                    color: tooltipText,
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                  itemStyle={{ color: tooltipText }}
                />
                <Area 
                  type="monotone" 
                  dataKey="users" 
                  stroke={barColor} 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorUsers)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Role Distribution" isDark={isDark}>
            <div className="flex flex-col items-center justify-center h-full relative">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={roleDistribution}
                    dataKey="value"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={4}
                    stroke={isDark ? "#1e293b" : "#fff"}
                    strokeWidth={4}
                    cornerRadius={6}
                  >
                    {roleDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                     contentStyle={{
                      backgroundColor: tooltipBg,
                      borderColor: gridColor,
                      borderRadius: "12px",
                      color: tooltipText,
                    }}
                    itemStyle={{ color: tooltipText }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-[-20px]">
                 <span className={`text-3xl font-bold ${isDark ? "text-white" : "text-slate-800"}`}>{stats.total}</span>
                 <span className={`text-xs uppercase tracking-wider ${isDark ? "text-slate-500" : "text-slate-400"}`}>Users</span>
              </div>
              
              <div className="flex flex-wrap justify-center gap-3 text-xs w-full mt-2">
                {roleDistribution.map((entry, index) => (
                  <div key={index} className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${isDark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"}`}>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index] }}></span>
                    <span className="font-semibold">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>
        </div>

        {/* === ✅ NEW SECTION: AUDIT LOGS === */}
        {/* Placed here so it's between charts and the user management table */}
        <AuditLogViewer isDark={isDark} />

        {/* === USER TABLE === */}
        <ChartCard title="User Database" isDark={isDark}>
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div className="relative w-full sm:w-72">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
              <input
                type="text"
                placeholder="Search users..."
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all ${
                  isDark 
                    ? "bg-slate-900 border-slate-700 text-slate-200 placeholder-slate-600 focus:border-indigo-500" 
                    : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400"
                }`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
                <button className={`p-2.5 rounded-xl border transition-colors ${isDark ? "border-slate-700 hover:bg-slate-800 text-slate-400" : "border-slate-200 hover:bg-slate-50 text-slate-500"}`}>
                    <Filter size={18} />
                </button>
            </div>
          </div>
          
          <div className={`overflow-x-auto rounded-xl border ${isDark ? "border-slate-800" : "border-slate-100"}`}>
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className={`text-xs uppercase tracking-wider ${
                  isDark ? "bg-slate-800/50 text-slate-400" : "bg-slate-50/80 text-slate-500"
                }`}>
                  <th className="py-4 px-6 font-semibold">User Profile</th>
                  <th className="py-4 px-6 font-semibold">Contact</th>
                  <th className="py-4 px-6 text-center font-semibold">Status</th>
                  <th className="py-4 px-6 text-center font-semibold">Access Level</th>
                  {/* ✅ NEW COLUMN HEADER */}
                  <th className="py-4 px-6 text-center font-semibold">Security Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? "divide-slate-800" : "divide-slate-100"}`}>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`group transition-colors ${isDark ? "hover:bg-slate-800/30" : "hover:bg-indigo-50/30"}`}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${
                            isDark ? "bg-indigo-900/40 text-indigo-300 ring-1 ring-indigo-500/30" : "bg-white text-indigo-600 ring-1 ring-indigo-100"
                          }`}>
                            {user.fullName.charAt(0)}
                          </div>
                          <div>
                            <div className={`font-medium ${isDark ? "text-slate-200" : "text-slate-900"}`}>{user.fullName}</div>
                            <div className={`text-xs ${isDark ? "text-slate-500" : "text-slate-500"}`}>ID: #{user.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className={`py-4 px-6 text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>{user.mobile}</td>
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                            user.member_status === "yes" || user.member_status === "Active"
                              ? isDark ? "bg-emerald-900/20 text-emerald-400 border-emerald-900/50" : "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : isDark ? "bg-amber-900/20 text-amber-400 border-amber-900/50" : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                             user.member_status === "yes" || user.member_status === "Active" ? "bg-emerald-500" : "bg-amber-500"
                          }`}></span>
                          {user.member_status || "Pending"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="relative inline-block w-32">
                          <select
                            className={`w-full appearance-none text-xs font-medium py-2 pl-3 pr-8 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all border shadow-sm ${
                              isDark 
                                ? "bg-slate-900 border-slate-700 text-slate-300 hover:border-indigo-500" 
                                : "bg-white border-slate-200 text-slate-700 hover:border-indigo-300"
                            } ${user.role === 'super_admin' ? 'text-violet-500 font-bold border-violet-200' : ''}`}
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            disabled={user.role === "super_admin"}
                          >
                            <option value="user">User</option>
                            <option value="pastor">Pastor</option>
                            <option value="admin">Admin</option>
                            
                            {/* ONLY SHOW SUPER ADMIN IF USER IS ALREADY ONE */}
                            {user.role === "super_admin" && (
                                <option value="super_admin">Super Admin</option>
                            )}
                            
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                             <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                          </div>
                        </div>
                      </td>
                      
                      {/* ✅ NEW: SECURITY CONTROLS */}
                      <td className="py-4 px-6 text-center">
                        <UserSecurityControls userId={user.id} userName={user.fullName} isDark={isDark} />
                      </td>

                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    {/* ✅ UPDATED COLSPAN TO 5 */}
                    <td colSpan="5" className={`text-center py-12 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                      <div className="flex flex-col items-center gap-2">
                        <Search className="h-8 w-8 opacity-20" />
                        <p>No users found matching "{searchTerm}"</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </main>
    </div>
  );
}

/* === ENHANCED CARD COMPONENTS === */
// These remain exactly as you had them

function StatCard({ title, value, subtitle, icon, gradient, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay, duration: 0.4 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`relative rounded-2xl p-6 overflow-hidden shadow-lg group`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90 group-hover:opacity-100 transition-opacity`}></div>
      <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white opacity-10 blur-xl group-hover:scale-150 transition-transform duration-700"></div>
      
      <div className="relative z-10 flex flex-col h-full justify-between text-white">
        <div className="flex justify-between items-start">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md shadow-inner border border-white/10">
                {icon}
            </div>
            <span className="text-xs font-medium bg-black/20 px-2 py-1 rounded-full backdrop-blur-sm border border-white/10">
                +2.5%
            </span>
        </div>
        
        <div className="mt-4">
            <h3 className="text-sm font-medium text-white/80">{title}</h3>
            <p className="text-3xl font-bold mt-1 tracking-tight">{value}</p>
            <p className="text-xs text-white/60 mt-1">{subtitle}</p>
        </div>
      </div>
    </motion.div>
  );
}

function ChartCard({ title, children, className = "", isDark }) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`p-6 rounded-2xl shadow-sm border transition-all duration-300 ${
        isDark 
          ? "bg-slate-900 border-slate-800 shadow-slate-900/50" 
          : "bg-white border-slate-100 shadow-slate-200/50"
      } ${className}`}
    >
      <div className="flex justify-between items-center mb-6 pb-2 border-b border-dashed border-slate-200 dark:border-slate-800">
        <h3 className={`font-bold text-lg ${isDark ? "text-slate-100" : "text-slate-800"}`}>
            {title}
        </h3>
        <button className={`p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${isDark ? "text-slate-500" : "text-slate-400"}`}>
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
        </button>
      </div>
      {children}
    </motion.div>
  );
}