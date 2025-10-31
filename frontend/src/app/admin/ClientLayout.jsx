// File: app/admin/ClientLayout.jsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Megaphone,
  BookOpen,
  DollarSign,
  FileText,
  Mail,
  MessageCircle,
  Handshake,
  GraduationCap,
  BarChart3,
  Video,
  Shield,
  LogOut,
  Settings,
  User,
  Globe,
  ChevronDown,
  Menu,
  X,
  Search,
  Sun,
  Moon,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { ThemeContext } from "../context/ThemeContext";

// Sidebar Menu Config
const menu = [
  {
    title: "Management",
    color: "from-blue-500 to-cyan-500",
    items: [
      { name: "Dashboard", icon: <LayoutDashboard className="text-blue-600 dark:text-blue-400" size={20} />, href: "/admin" },
      { name: "Announcements", icon: <Megaphone className="text-indigo-600 dark:text-indigo-400" size={20} />, href: "/admin/announcements" },
      { name: "Attendance", icon: <FileText className="text-cyan-600 dark:text-cyan-400" size={20} />, href: "/admin/attendance" },
      { name: "Members", icon: <Users className="text-green-600 dark:text-green-400" size={20} />, href: "/admin/members" },
      { name: "Visitors", icon: <Users className="text-amber-600 dark:text-amber-400" size={20} />, href: "/admin/visitors" },
      { name: "Events", icon: <Calendar className="text-pink-600 dark:text-pink-400" size={20} />, href: "/admin/events" },
    ],
  },
  {
    title: "Finance",
    color: "from-green-500 to-lime-500",
    items: [
      { name: "Contributions", icon: <DollarSign className="text-emerald-600 dark:text-emerald-400" size={20} />, href: "/admin/contributions" },
      { name: "Payments", icon: <DollarSign className="text-green-600 dark:text-green-400" size={20} />, href: "/admin/payments" },
      { name: "Expenses", icon: <DollarSign className="text-orange-600 dark:text-orange-400" size={20} />, href: "/admin/expenses" },
      { name: "Accounting", icon: <FileText className="text-teal-600 dark:text-teal-400" size={20} />, href: "/admin/accounting" },
    ],
  },
  {
    title: "Reports",
    color: "from-purple-500 to-pink-500",
    items: [
      { name: "Analytics", icon: <BarChart3 className="text-purple-600 dark:text-purple-400" size={20} />, href: "/admin/reports/analytics" },
      { name: "Growth Trends", icon: <BarChart3 className="text-pink-600 dark:text-pink-400" size={20} />, href: "/admin/reports/growth" },
    ],
  },
  {
    title: "Administration",
    color: "from-gray-600 to-slate-500",
    items: [{ name: "Users", icon: <Shield className="text-slate-600 dark:text-slate-400" size={20} />, href: "/admin/users" }],
  },
];

// Sidebar Component
function SidebarMenu({ menu, isOpen, onNavigate, onClose, searchQuery, setSearchQuery, theme }) {
  return (
    <motion.nav
      initial={{ width: isOpen ? 224 : 64 }}
      animate={{ width: isOpen ? 224 : 64 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={`h-full border-r border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden ${
        theme === "dark" ? "bg-gradient-to-b from-gray-900 to-gray-800" : "bg-gradient-to-b from-white to-gray-50"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Logo + Close */}
        <motion.div
          className="flex items-center justify-between px-4 py-5 border-b border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: isOpen ? 1.15 : 1 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src="/pure.jpg"
                alt="Pure Gospel Logo"
                width={isOpen ? 40 : 32}
                height={isOpen ? 40 : 32}
                className="rounded-full object-cover shadow-sm"
              />
            </motion.div>
            <AnimatePresence>
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`font-bold text-lg ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}
                >
                  Pure Gospel
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          {onClose && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Close menu"
            >
              <X size={20} className={theme === "dark" ? "text-gray-200" : "text-gray-800"} />
            </motion.button>
          )}
        </motion.div>

        {/* Animated Search Bar */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 16 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="px-4"
            >
              <motion.div
                initial={{ scaleX: 0.95, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="relative"
              >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search menu items..."
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all shadow-sm ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-gray-200 focus:ring-emerald-400 focus:border-emerald-400"
                      : "bg-gray-100 border-gray-200 text-gray-800 focus:ring-emerald-500 focus:border-emerald-500"
                  }`}
                />
                <AnimatePresence>
                  {searchQuery && (
                    <motion.button
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                    >
                      <X size={16} />
                    </motion.button>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-4 px-2">
          {menu
            .map((section) => ({
              ...section,
              items: section.items.filter(
                (item) =>
                  !searchQuery ||
                  item.name.toLowerCase().includes(searchQuery.toLowerCase())
              ),
            }))
            .filter((section) => section.items.length > 0)
            .map((section, idx) => (
              <motion.div
                key={idx}
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <AnimatePresence>
                  {isOpen && (
                    <motion.h4
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`px-3 mb-2 text-xs font-bold uppercase tracking-wider bg-gradient-to-r ${section.color} bg-clip-text text-transparent`}
                    >
                      {section.title}
                    </motion.h4>
                  )}
                </AnimatePresence>

                <div className="space-y-1">
                  {section.items.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        onClick={onNavigate}
                        className={`flex items-center gap-3 py-2.5 px-3 rounded-xl transition-all duration-200 group active:scale-98 ${
                          theme === "dark"
                            ? "text-gray-300 hover:bg-gradient-to-r hover:from-emerald-900 hover:to-teal-900 hover:text-emerald-300"
                            : "text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:text-emerald-700"
                        }`}
                      >
                        <motion.div
                          className={`group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          {item.icon}
                        </motion.div>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.span
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              className="text-sm font-medium"
                            >
                              {item.name}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </motion.nav>
  );
}

export default function ClientAdminLayout({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [lang, setLang] = useState("en");
  const [profileOpen, setProfileOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState("light");
  const profileRef = useRef(null);

  // Auth check
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const token = localStorage.getItem("token");

    if (!user || !token || user.role?.toLowerCase() !== "admin") {
      router.replace("/login");
    } else {
      setAuthorized(true);
    }
    setLoading(false);
  }, [router]);

  // Theme persistence
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800"
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mx-auto mb-4"
          />
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-700 dark:text-gray-300 font-medium"
          >
            Authenticating...
          </motion.p>
        </div>
      </motion.div>
    );
  }

  if (!authorized) return null;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`flex min-h-screen text-gray-800 dark:text-gray-200 ${theme === "dark" ? "bg-gray-900" : "bg-gray-100"}`}>
        {/* Desktop Sidebar */}
        <div
          className="hidden lg:flex relative group"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <SidebarMenu
            menu={menu}
            isOpen={isOpen}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            theme={theme}
          />
        </div>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed left-0 top-0 h-full z-50 lg:hidden w-64"
              >
                <SidebarMenu
                  menu={menu}
                  isOpen={true}
                  onClose={() => setIsOpen(false)}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  theme={theme}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <motion.header
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`flex items-center border-b sticky top-0 z-10 px-4 md:px-6 py-2.5 shadow-sm ${
              theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Menu size={24} className={theme === "dark" ? "text-gray-200" : "text-gray-800"} />
            </motion.button>
            <div className="flex-grow" />
            <div className="flex items-center gap-3 md:gap-4">
              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Toggle theme"
              >
                {theme === "light" ? <Moon size={20} className="text-gray-700 dark:text-gray-300" /> : <Sun size={20} className="text-gray-200" />}
              </motion.button>

              {/* Language Selector */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${
                  theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"
                }`}
              >
                <Globe size={16} className={theme === "dark" ? "text-gray-300" : "text-gray-700"} />
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className={`bg-transparent outline-none text-sm font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}
                >
                  <option value="en">English</option>
                  <option value="am">አማርኛ</option>
                </select>
              </motion.div>

              {/* Profile */}
              <div ref={profileRef} className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setProfileOpen(!profileOpen)}
                  className={`flex items-center gap-2 text-white rounded-full px-3 py-1.5 shadow-md hover:shadow-lg ${
                    theme === "dark"
                      ? "bg-gradient-to-br from-indigo-700 to-purple-700"
                      : "bg-gradient-to-br from-indigo-500 to-purple-600"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <User size={16} />
                  </div>
                  <span className="hidden sm:inline text-sm font-medium">Admin</span>
                  <motion.div animate={{ rotate: profileOpen ? 180 : 0 }}>
                    <ChevronDown size={16} />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className={`absolute right-0 mt-2 w-56 rounded-2xl shadow-xl border z-50 ${
                        theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
                      }`}
                    >
                      <div className="p-2 space-y-1">
                        <motion.div whileHover={{ backgroundColor: theme === "dark" ? "#4b5563" : "#f3f4f6" }}>
                          <Link
                            href="/admin/profile"
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}
                            onClick={() => setProfileOpen(false)}
                          >
                            <User size={18} /> <span className="text-sm font-medium">Profile</span>
                          </Link>
                        </motion.div>
                        <motion.div whileHover={{ backgroundColor: theme === "dark" ? "#4b5563" : "#f3f4f6" }}>
                          <Link
                            href="/admin/settings"
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}
                            onClick={() => setProfileOpen(false)}
                          >
                            <Settings size={18} /> <span className="text-sm font-medium">Settings</span>
                          </Link>
                        </motion.div>
                        <div className="my-2 border-t border-gray-100 dark:border-gray-700" />
                        <motion.div whileHover={{ backgroundColor: theme === "dark" ? "#7f1d1d" : "#fee2e2" }}>
                          <button
                            onClick={() => {
                              localStorage.clear();
                              router.push("/");
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl ${theme === "dark" ? "text-red-400" : "text-red-600"}`}
                          >
                            <LogOut size={18} /> <span className="text-sm font-medium">Logout</span>
                          </button>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.header>

          {/* Page Content */}
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`p-4 sm:p-6 flex-1 ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}
          >
            {children}
          </motion.main>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}