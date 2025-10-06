export default function MemberLayout({ children }) {
  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-700 text-white min-h-screen p-4">
        <h2 className="text-xl font-bold mb-6">Member Dashboard</h2>
        <nav className="space-y-3">
          <a href="/member" className="block hover:underline">Home</a>
          <a href="/member/profile" className="block hover:underline">Profile</a>
          <a href="/member/events" className="block hover:underline">Events</a>
          <a href="/member/offerings" className="block hover:underline">Offerings</a>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 bg-gray-50">{children}</main>
    </div>
  );
}
