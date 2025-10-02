import { Users, Calendar, DollarSign, Book, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="space-y-8">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Members"
          value="1,240"
          icon={<Users className="h-8 w-8" />}
          color="bg-green-600"
        />
        <StatCard
          title="Contributions"
          value="KES 450,000"
          icon={<DollarSign className="h-8 w-8" />}
          color="bg-blue-600"
        />
        <StatCard
          title="Expenses"
          value="KES 120,000"
          icon={<BarChart3 className="h-8 w-8" />}
          color="bg-orange-500"
        />
        <StatCard
          title="Wallet Balance"
          value="KES 330,000"
          icon={<Book className="h-8 w-8" />}
          color="bg-purple-600"
        />
      </div>

      {/* Activity Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentCard title="Recent Members" items={["John Doe", "Mary Wanjiku"]} />
        <RecentCard
          title="Recent Contributions"
          items={["KES 5,000 - Jane", "KES 2,500 - Paul"]}
        />
        <RecentCard
          title="Recent Expenses"
          items={["Church Rent - 50,000", "Instruments - 25,000"]}
        />
        <RecentCard
          title="Upcoming Events"
          items={["Youth Fellowship - Oct 5", "Choir Practice - Oct 7"]}
        />
      </div>

      {/* Quick Links */}
      <div className="bg-white p-6 shadow rounded-lg">
        <h3 className="font-semibold mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <QuickLink label="Add Member" color="green" href="/admin/members/new" />
          <QuickLink label="Record Contribution" color="blue" href="/admin/contributions/new" />
          <QuickLink label="Add Expense" color="orange" href="/admin/expenses/new" />
          <QuickLink label="Create Event" color="purple" href="/admin/events/new" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div
      className={`${color} text-white p-6 rounded-lg shadow flex items-center justify-between`}
    >
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-2xl mt-2">{value}</p>
      </div>
      <div>{icon}</div>
    </div>
  );
}

function RecentCard({ title, items }) {
  return (
    <div className="bg-white p-6 shadow rounded-lg">
      <h3 className="font-semibold mb-4">{title}</h3>
      <ul className="text-gray-700 space-y-2">
        {items.length > 0 ? (
          items.map((item, i) => <li key={i}>{item}</li>)
        ) : (
          <li>No data available</li>
        )}
      </ul>
    </div>
  );
}

function QuickLink({ label, color, href }) {
  return (
    <Link
      href={href}
      className={`bg-${color}-100 text-${color}-700 px-4 py-2 rounded shadow hover:bg-${color}-200`}
    >
      {label}
    </Link>
  );
}
