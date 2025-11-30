<div>
  <h1>Pastor's Desk</h1>
  
  <div className="grid grid-cols-2 gap-4">
    {/* Critical Action Item */}
    <div className="bg-red-50 p-4 rounded border border-red-200">
      <h3 className="text-red-700 font-bold">⚠️ Visitors Needing Follow-up</h3>
      <ul>
         <li>New Visitor: Sarah Smith (Visited: Sunday) - <button>Mark Visited</button></li>
         <li>New Visitor: Mark Jones (Visited: Sunday) - <button>Mark Visited</button></li>
      </ul>
    </div>

    {/* Community Item */}
    <div className="bg-blue-50 p-4 rounded border border-blue-200">
      <h3 className="text-blue-700 font-bold">🎂 Birthdays This Week</h3>
      <ul>
         <li>Brother James (Nov 30)</li>
         <li>Sister Mary (Dec 02)</li>
      </ul>
    </div>
  </div>

  <div className="mt-6">
    <h3>Attendance Overview</h3>
    {/* Insert Chart Component Here */}
  </div>
</div>