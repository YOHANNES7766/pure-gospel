"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Megaphone,
  BookOpen,
  DollarSign,
  FileText,
  LogOut,
  Mail,
  MessageCircle,
  Handshake,
  GraduationCap,
  BarChart3,
  Video,
  Shield,
} from "lucide-react";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold text-gray-700">
        Checking admin access...
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  // Sidebar grouped menu
  const menu = [
    {
      title: "Management",
      items: [
        { name: "Dashboard", icon: <LayoutDashboard size={18} />, href: "/admin" },
        { name: "Announcements", icon: <Megaphone size={18} />, href: "/admin/announcements" },
        { name: "Attendance", icon: <FileText size={18} />, href: "/admin/attendance" },
        { name: "Members", icon: <Users size={18} />, href: "/admin/members" },
        { name: "Visitors", icon: <Users size={18} />, href: "/admin/visitors" },
        { name: "Events", icon: <Calendar size={18} />, href: "/admin/events" },
      ],
    },
    {
      title: "Finance",
      items: [
        { name: "Contributions", icon: <DollarSign size={18} />, href: "/admin/contributions" },
        { name: "Payments", icon: <DollarSign size={18} />, href: "/admin/payments" },
        { name: "Expenses", icon: <DollarSign size={18} />, href: "/admin/expenses" },
        { name: "Accounting", icon: <FileText size={18} />, href: "/admin/accounting" },
      ],
    },
    {
      title: "Engagement",
      items: [
        { name: "Communications", icon: <Mail size={18} />, href: "/admin/communications" },
        { name: "Meetings", icon: <Calendar size={18} />, href: "/admin/meetings" },
        { name: "Prayer Requests", icon: <MessageCircle size={18} />, href: "/admin/prayers" },
      ],
    },
    {
      title: "Volunteers",
      items: [
        { name: "Volunteer Scheduling", icon: <Handshake size={18} />, href: "/admin/volunteers" },
        { name: "Ministry Groups", icon: <Users size={18} />, href: "/admin/groups" },
      ],
    },
    {
      title: "Education",
      items: [
        { name: "Sunday School", icon: <GraduationCap size={18} />, href: "/admin/sunday-school" },
        { name: "Bible Study", icon: <BookOpen size={18} />, href: "/admin/bible-study" },
      ],
    },
    {
      title: "Reports",
      items: [
        { name: "Analytics", icon: <BarChart3 size={18} />, href: "/admin/reports/analytics" },
        { name: "Growth Trends", icon: <BarChart3 size={18} />, href: "/admin/reports/growth" },
      ],
    },
    {
      title: "Resources",
      items: [
        { name: "Books", icon: <BookOpen size={18} />, href: "/admin/resources/books" },
        { name: "Sermons & Media", icon: <Video size={18} />, href: "/admin/resources/media" },
      ],
    },
    {
      title: "Administration",
      items: [{ name: "Users", icon: <Shield size={18} />, href: "/admin/users" }],
    },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-sm">
        <div className="p-6 text-xl font-bold text-green-700 border-b">
          ⛪ Pure Gospel
        </div>
        <nav className="mt-4 space-y-6">
          {menu.map((section, idx) => (
            <div key={idx}>
              <h4 className="px-4 text-xs font-semibold text-gray-500 uppercase mb-2">
                {section.title}
              </h4>
              <div className="space-y-1">
                {section.items.map((item, i) => (
                  <Link
                    key={i}
                    href={item.href}
                    className="flex items-center gap-2 py-2 px-4 rounded-md text-gray-700 hover:bg-green-100 hover:text-green-700 transition"
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center bg-white border-b px-8 py-4 shadow-sm sticky top-0 z-10">
          <h1 className="text-xl font-bold text-green-700">Admin Dashboard</h1>
          <button
            onClick={() => {
              localStorage.clear();
              router.push("/login");
            }}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
          >
            <LogOut size={16} />
            Logout
          </button>
        </header>

        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
