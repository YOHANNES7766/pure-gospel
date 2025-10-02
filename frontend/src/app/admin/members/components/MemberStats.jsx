export default function MemberStats() {
  const stats = [
    { label: "Active", value: 1, color: "bg-green-600" },
    { label: "Inactive", value: 0, color: "bg-red-600" },
    { label: "Men", value: 1, color: "bg-blue-600" },
    { label: "Women", value: 0, color: "bg-pink-600" },
    { label: "Youth Men", value: 0, color: "bg-indigo-600" },
    { label: "Youth Ladies", value: 0, color: "bg-purple-600" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="bg-white shadow p-4 rounded text-center border"
        >
          <div className={`text-white text-lg font-bold ${stat.color} w-10 h-10 mx-auto rounded-full flex items-center justify-center`}>
            {stat.value}
          </div>
          <p className="mt-2 font-medium text-gray-700">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
