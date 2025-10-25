export default function VisitorStats({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
      {[
        { label: "Total Visitors", value: stats.total },
        { label: "This Week", value: stats.week },
        { label: "This Month", value: stats.month },
      ].map((s, i) => (
        <div
          key={i}
          className="bg-white rounded-lg p-4 text-center shadow border"
        >
          <p className="text-gray-500 text-sm">{s.label}</p>
          <p className="text-2xl font-semibold">{s.value}</p>
        </div>
      ))}
    </div>
  );
}
