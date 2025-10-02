import Link from "next/link";

export default function MemberTable() {
  const members = [
    {
      id: 2345,
      name: "Yohannes Dawit Bireda",
      phone: "0965548360",
      category: "Men",
      status: "Active",
      registration: "Pending",
    },
  ];

  return (
    <div className="bg-white shadow rounded-lg p-4">
      {members.map((m) => (
        <div
          key={m.id}
          className="flex justify-between items-center border-b py-4"
        >
          <div>
            <h3 className="font-semibold">{m.name} - {m.id}</h3>
            <p className="text-sm text-gray-500">{m.phone}</p>
          </div>
          <div className="flex gap-6 text-sm">
            <p>
              <span className="font-semibold">Category:</span> {m.category}
            </p>
            <p>
              <span className="font-semibold">Status:</span>{" "}
              <span className="px-2 py-1 rounded text-white bg-green-600">
                {m.status}
              </span>
            </p>
            <p>
              <span className="font-semibold">Registration:</span>{" "}
              <span className="px-2 py-1 rounded text-white bg-red-600">
                {m.registration}
              </span>
            </p>
          </div>
          <div className="space-x-2">
            <Link
              href={`/admin/members/${m.id}`}
              className="px-3 py-1 border rounded bg-blue-100 text-blue-700"
            >
              View
            </Link>
            <Link
              href={`/admin/members/${m.id}/edit`}
              className="px-3 py-1 border rounded bg-orange-100 text-orange-700"
            >
              Edit
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
