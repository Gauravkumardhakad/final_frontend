import React from "react";

export default function RecentComplaintsTable({ complaints = [] }) {
  if (complaints.length === 0) {
    return (
      <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 text-slate-400">
        No recent complaints found.
      </div>
    );
  }

  return (
    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
      <h2 className="text-lg font-semibold text-blue-400 mb-4">Recent Complaints</h2>
      <table className="w-full text-sm text-slate-300">
        <thead>
          <tr className="text-left border-b border-slate-700">
            <th className="pb-2">Title</th>
            <th className="pb-2">Department</th>
            <th className="pb-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {complaints.slice(0, 5).map((c) => (
            <tr key={c._id} className="border-b border-slate-800 hover:bg-slate-700/30 transition">
              <td className="py-2">{c.title}</td>
              <td className="py-2">{c.department}</td>
              <td className="py-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    c.status === "Resolved"
                      ? "bg-green-600/20 text-green-400"
                      : c.status === "Pending"
                      ? "bg-yellow-600/20 text-yellow-400"
                      : "bg-blue-600/20 text-blue-400"
                  }`}
                >
                  {c.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
