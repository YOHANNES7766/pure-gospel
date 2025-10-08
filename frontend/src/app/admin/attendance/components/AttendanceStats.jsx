export default function AttendanceStats({ stats }) {
  return (
    <div className="bg-white border rounded-lg p-4 mb-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">
        Attendance Statistics
      </h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-3 bg-gray-50 border rounded text-center">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-xl font-bold">{stats.total}</p>
        </div>
        <div className="p-3 bg-green-50 border rounded text-center">
          <p className="text-sm text-gray-600">Present</p>
          <p className="text-xl font-bold text-green-600">{stats.present}</p>
        </div>
        <div className="p-3 bg-red-50 border rounded text-center">
          <p className="text-sm text-gray-600">Absent</p>
          <p className="text-xl font-bold text-red-600">{stats.absent}</p>
        </div>
      </div>
    </div>
  );
}
