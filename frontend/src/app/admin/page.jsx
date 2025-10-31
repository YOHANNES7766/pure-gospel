// File: app/admin/page.jsx
"use client";

import { useContext } from "react";
import Link from "next/link";
import {
  Users,
  DollarSign,
  BarChart3,
  Book,
  Plus,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { ThemeContext } from "../context/ThemeContext";

/* === Sample data === */
const contributionData = [
  { month: "Jan", amount: 20000 },
  { month: "Feb", amount: 30000 },
  { month: "Mar", amount: 25000 },
  { month: "Apr", amount: 40000 },
  { month: "May", amount: 38000 },
  { month: "Jun", amount: 42000 },
];

const expenseData = [
  { month: "Jan", amount: 10000 },
  { month: "Feb", amount: 18000 },
  { month: "Mar", amount: 15000 },
  { month: "Apr", amount: 20000 },
  { month: "May", amount: 21000 },
  { month: "Jun", amount: 25000 },
];

const attendanceData = [
  { name: "Men", value: 400 },
  { name: "Women", value: 500 },
  { name: "Youth", value: 300 },
  { name: "Children", value: 200 },
];

const yearlyData = [
  { name: "Dec 22", direct: 1200, indirect: 4800 },
  { name: "Jan 23", direct: 2200, indirect: 2300 },
  { name: "Feb 23", direct: 1500, indirect: 5300 },
  { name: "Mar 23", direct: 1800, indirect: 4700 },
  { name: "Apr 23", direct: 2000, indirect: 5100 },
  { name: "May 23", direct: 1700, indirect: 4900 },
];

const COLORS = ["#4ade80", "#60a5fa", "#facc15", "#a78bfa"];

/* === MAIN COMPONENT === */
export default function ChurchAdminDashboard() {
  const { theme } = useContext(ThemeContext);
  const axisColor = theme === "dark" ? "#9ca3af" : "#9ca3af";
  const contributionLineColor = theme === "dark" ? "#818cf8" : "#6366f1";
  const expenseLineColor = theme === "dark" ? "#fbbf24" : "#f59e0b";
  const directBarColor = theme === "dark" ? "#60a5fa" : "#3b82f6";
  const indirectBarColor = theme === "dark" ? "#c084fc" : "#a855f7";

  return (
    <div className="bg-transparent text-gray-800 dark:text-gray-200 px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* HEADER */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-800 dark:text-gray-200">
          Pure Gospel Management • Admin Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm sm:text-base">
          Overview of your church activities and financial performance
        </p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Members"
          value="1,240"
          subtitle="Active this month"
          icon={<Users className="h-6 w-6" />}
          gradient="from-green-400 via-emerald-500 to-teal-600"
        />
        <StatCard
          title="Total Contributions"
          value="KES 450,000"
          subtitle="This month"
          icon={<DollarSign className="h-6 w-6" />}
          gradient="from-blue-400 via-sky-500 to-indigo-600"
        />
        <StatCard
          title="Total Expenses"
          value="KES 120,000"
          subtitle="This month"
          icon={<BarChart3 className="h-6 w-6" />}
          gradient="from-orange-400 via-amber-500 to-yellow-600"
        />
        <StatCard
          title="Wallet Balance"
          value="KES 330,000"
          subtitle="Available"
          icon={<Book className="h-6 w-6" />}
          gradient="from-purple-400 via-fuchsia-500 to-pink-600"
        />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <ChartCard title="Contribution Trends">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={contributionData}>
              <XAxis dataKey="month" stroke={axisColor} />
              <YAxis stroke={axisColor} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="amount"
                stroke={contributionLineColor}
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Expenses Overview">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={expenseData}>
              <XAxis dataKey="month" stroke={axisColor} />
              <YAxis stroke={axisColor} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="amount"
                stroke={expenseLineColor}
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Attendance Breakdown">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={attendanceData} dataKey="value" outerRadius={70} label>
                {attendanceData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ACTIVITY & QUICK ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <RecentActivity />
        <QuickActions />
      </div>

      {/* INVOICES & REPORT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <ChartCard title="Recently Incoming Invoice">
          <InvoiceItem color="purple" text={<><b>Yossef Ethiopia</b> paid for building fund</>} />
          <InvoiceItem color="red" text={<><b>Yohannes Dawit</b> paid 50% of offerings</>} />
          <InvoiceItem color="green" text={<><b>Zekaries</b> paid for full service</>} />
          <InvoiceItem color="blue" text={<><b>Birhan Bank</b> paid 15,000 ETB for <b>donations</b></>} />
        </ChartCard>

        <ChartCard title="Yearly Report">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={yearlyData}>
              <XAxis dataKey="name" stroke={axisColor} />
              <YAxis stroke={axisColor} />
              <Tooltip />
              <Bar dataKey="direct" fill={directBarColor} radius={[6, 6, 0, 0]} />
              <Bar dataKey="indirect" fill={indirectBarColor} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

/* === COMPONENTS === */
function StatCard({ title, value, subtitle, icon, gradient }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`rounded-2xl p-5 sm:p-6 text-white bg-gradient-to-br ${gradient} shadow-md`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="p-3 bg-white/20 rounded-xl">{icon}</div>
      </div>
      <h3 className="text-sm sm:text-base font-medium opacity-90">{title}</h3>
      <p className="text-xl sm:text-2xl font-bold mt-2">{value}</p>
      <p className="text-xs sm:text-sm opacity-80 mt-1">{subtitle}</p>
    </motion.div>
  );
}

function ChartCard({ title, children }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
    >
      <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 text-base sm:text-lg">
        {title}
      </h3>
      {children}
    </motion.div>
  );
}

function RecentActivity() {
  const activities = [
    "John Doe joined the church",
    "Youth Fellowship meeting set for Oct 30",
    "KES 5,000 contribution from Jane",
    "New expense: Choir Equipment - KES 25,000",
  ];
  return (
    <ChartCard title="Recent Activity">
      <ul className="space-y-3 text-gray-700 dark:text-gray-400 text-sm sm:text-base">
        {activities.map((a, i) => (
          <motion.li
            key={i}
            whileHover={{ x: 5 }}
            className="border-b border-gray-100 dark:border-gray-700 pb-2 last:border-none"
          >
            {a}
          </motion.li>
        ))}
      </ul>
    </ChartCard>
  );
}

function QuickActions() {
  const actions = [
    { label: "Add Member", href: "/admin/members/new", color: "green" },
    { label: "Record Contribution", href: "/admin/contributions/new", color: "blue" },
    { label: "Add Expense", href: "/admin/expenses/new", color: "orange" },
    { label: "Create Event", href: "/admin/events/new", color: "purple" },
  ];
  return (
    <ChartCard title="Quick Actions">
      <div className="flex flex-wrap gap-3">
        {actions.map((a, i) => (
          <motion.div key={i} whileHover={{ scale: 1.05 }}>
            <Link
              href={a.href}
              className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium shadow-sm bg-${a.color}-50 dark:bg-${a.color}-900 text-${a.color}-600 dark:text-${a.color}-300 text-sm sm:text-base`}
            >
              <Plus className="h-4 w-4" />
              {a.label}
            </Link>
          </motion.div>
        ))}
      </div>
    </ChartCard>
  );
}

function InvoiceItem({ color, text }) {
  const colors = {
    red: "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200",
    blue: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200",
    purple: "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200",
    green: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200",
  };
  return (
    <motion.div
      whileHover={{ x: 4 }}
      className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 text-sm sm:text-base"
    >
      <div className="flex items-center gap-3 mb-2 sm:mb-0">
        <div className={`p-2 rounded-full ${colors[color]}`}>
          <ArrowRight className="h-4 w-4" />
        </div>
        <div className="text-gray-700 dark:text-gray-300">{text}</div>
      </div>
      <Link href="#" className="text-purple-600 dark:text-purple-400 hover:underline text-sm">
        View →
      </Link>
    </motion.div>
  );
}