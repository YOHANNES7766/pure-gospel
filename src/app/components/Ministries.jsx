import {
  MusicalNoteIcon,
  UsersIcon,
  HandRaisedIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

const ministries = [
  {
    title: "Youth Ministry",
    description:
      "Empowering the next generation through fellowship, discipleship, and fun activities that build faith.",
    icon: UsersIcon,
  },
  {
    title: "Worship & Music",
    description:
      "Leading the congregation into God’s presence with heartfelt worship and spirit-filled praise.",
    icon: MusicalNoteIcon,
  },
  {
    title: "Outreach & Missions",
    description:
      "Sharing the love of Christ in our community and beyond through service and evangelism.",
    icon: HandRaisedIcon,
  },
  {
    title: "Prayer Ministry",
    description:
      "Standing in the gap through intercession, prayer meetings, and spiritual support for all.",
    icon: SparklesIcon,
  },
];

export default function Ministries() {
  return (
    <section id="ministries" className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto text-center">
        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
          Our Ministries
        </h2>
        <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
          Discover how we serve God and people through dedicated ministries
          designed to nurture faith, foster community, and reach the world.
        </p>

        {/* Ministries Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {ministries.map((ministry, index) => (
            <div
              key={index}
              className="p-6 bg-gray-50 hover:bg-blue-50 rounded-xl shadow-md transition-transform transform hover:scale-105 text-center"
            >
              <ministry.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-blue-700">
                {ministry.title}
              </h3>
              <p className="text-gray-600 text-sm">{ministry.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
