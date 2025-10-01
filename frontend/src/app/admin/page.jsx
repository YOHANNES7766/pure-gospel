"use client";

import { Users, Calendar, HandCoins, Settings } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-blue-700">Church Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back 👋 — manage your church efficiently.</p>
      </header>

      {/* Stats Section */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-2xl shadow p-5 flex items-center space-x-4">
          <div className="bg-blue-100 p-3 rounded-xl">
            <Users className="text-blue-600" size={28} />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Members</p>
            <p className="text-2xl font-bold">1,245</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-5 flex items-center space-x-4">
          <div className="bg-green-100 p-3 rounded-xl">
            <Calendar className="text-green-600" size={28} />
          </div>
          <div>
            <p className="text-sm text-gray-600">Upcoming Events</p>
            <p className="text-2xl font-bold">6</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-5 flex items-center space-x-4">
          <div className="bg-yellow-100 p-3 rounded-xl">
            <HandCoins className="text-yellow-600" size={28} />
          </div>
          <div>
            <p className="text-sm text-gray-600">Monthly Donations</p>
            <p className="text-2xl font-bold">$4,320</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-5 flex items-center space-x-4">
          <div className="bg-purple-100 p-3 rounded-xl">
            <Settings className="text-purple-600" size={28} />
          </div>
          <div>
            <p className="text-sm text-gray-600">Active Ministries</p>
            <p className="text-2xl font-bold">8</p>
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="max-w-6xl mx-auto bg-white rounded-2xl shadow p-6 mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition">
            ➕ Add New Member
          </button>
          <button className="w-full bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition">
            📅 Schedule Event
          </button>
          <button className="w-full bg-yellow-600 text-white py-3 rounded-xl font-medium hover:bg-yellow-700 transition">
            💰 Record Donation
          </button>
        </div>
      </section>

      {/* Recent Events Section */}
      <section className="max-w-6xl mx-auto bg-white rounded-2xl shadow p-6">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">Recent Events</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-sm font-medium text-gray-600">Event Name</th>
                <th className="p-3 text-sm font-medium text-gray-600">Date</th>
                <th className="p-3 text-sm font-medium text-gray-600">Location</th>
                <th className="p-3 text-sm font-medium text-gray-600">Attendees</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Youth Fellowship", date: "Oct 5, 2025", location: "Main Hall", attendees: 45 },
                { name: "Bible Study", date: "Oct 7, 2025", location: "Room 3", attendees: 30 },
                { name: "Sunday Service", date: "Oct 12, 2025", location: "Auditorium", attendees: 300 },
              ].map((event, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50">
                  <td className="p-3 text-gray-800">{event.name}</td>
                  <td className="p-3 text-gray-800">{event.date}</td>
                  <td className="p-3 text-gray-800">{event.location}</td>
                  <td className="p-3 text-gray-800">{event.attendees}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
