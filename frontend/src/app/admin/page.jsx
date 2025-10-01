// app/admin/page.jsx
export default function AdminPage() {
  return (
    <div className="space-y-8">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-green-500 text-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Total Members</h2>
          <p className="text-3xl mt-2">0</p>
        </div>
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Total Contributions</h2>
          <p className="text-3xl mt-2">0.00</p>
        </div>
        <div className="bg-orange-500 text-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Total Expenses</h2>
          <p className="text-3xl mt-2">0.00</p>
        </div>
        <div className="bg-purple-600 text-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Wallet Balance</h2>
          <p className="text-3xl mt-2">KES 0</p>
        </div>
      </div>

      {/* Recent Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 shadow rounded-lg">
          <h3 className="font-semibold mb-4">Recent Members</h3>
          <ul className="text-gray-600 space-y-2">
            <li>No recent members</li>
          </ul>
        </div>
        <div className="bg-white p-6 shadow rounded-lg">
          <h3 className="font-semibold mb-4">Recent Contributions</h3>
          <ul className="text-gray-600 space-y-2">
            <li>No contributions</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 shadow rounded-lg">
          <h3 className="font-semibold mb-4">Recent Expenses</h3>
          <ul className="text-gray-600 space-y-2">
            <li>No expenses</li>
          </ul>
        </div>
        <div className="bg-white p-6 shadow rounded-lg">
          <h3 className="font-semibold mb-4">Upcoming Events</h3>
          <ul className="text-gray-600 space-y-2">
            <li>No upcoming events</li>
          </ul>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white p-6 shadow rounded-lg">
        <h3 className="font-semibold mb-4">Quick Links</h3>
        <div className="flex flex-wrap gap-4">
          <a href="#" className="bg-green-100 text-green-700 px-4 py-2 rounded">Add Member</a>
          <a href="#" className="bg-blue-100 text-blue-700 px-4 py-2 rounded">Record Contribution</a>
          <a href="#" className="bg-orange-100 text-orange-700 px-4 py-2 rounded">Add Expense</a>
          <a href="#" className="bg-purple-100 text-purple-700 px-4 py-2 rounded">Create Event</a>
        </div>
      </div>
    </div>
  );
}
