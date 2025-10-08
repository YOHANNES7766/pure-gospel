export default function AttendanceTable({ records }) {
  return (
    <div className="overflow-x-auto bg-white shadow-sm rounded-lg border border-gray-200">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100 text-gray-800 text-left">
          <tr>
            <th className="p-3 font-semibold">Member Name</th>
            <th className="p-3 font-semibold">Fellowship Type</th>
            <th className="p-3 font-semibold">Member Category</th>
            <th className="p-3 font-semibold">Attendance Category</th>
            <th className="p-3 font-semibold">Status</th>
            <th className="p-3 font-semibold">Date</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r, idx) => (
            <tr key={idx} className="border-t hover:bg-gray-50">
              <td className="p-3">{r.name}</td>
              <td className="p-3">{r.fellowship}</td>
              <td className="p-3">{r.category}</td>
              <td className="p-3">{r.attendanceCategory}</td>
              <td className="p-3">
                {r.status === "Present" ? (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                    Present
                  </span>
                ) : (
                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium">
                    Absent
                  </span>
                )}
              </td>
              <td className="p-3">{r.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
