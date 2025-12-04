// src/components/MyComplaintsPage.jsx
import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Filter,
  List,
  LayoutGrid,
  ChevronRight,
  MapPin,
  Calendar,
} from "lucide-react";
import API from "../api/axios";

// --- Status Chip ---
const StatusChip = ({ status }) => {
  const baseStyle =
    "rounded-full px-3 py-1 text-xs font-medium shadow-md capitalize";
  switch (status) {
    case "Pending":
      return (
        <span
          className={`${baseStyle} bg-yellow-500/20 text-yellow-300 shadow-yellow-500/20`}
        >
          {status}
        </span>
      );
    case "Resolved":
      return (
        <span
          className={`${baseStyle} bg-green-500/20 text-green-300 shadow-green-500/20`}
        >
          {status}
        </span>
      );
    case "In Progress":
      return (
        <span
          className={`${baseStyle} bg-blue-500/20 text-blue-300 shadow-blue-500/20`}
        >
          {status}
        </span>
      );
    default:
      return (
        <span className={`${baseStyle} bg-slate-600/20 text-slate-300`}>
          {status}
        </span>
      );
  }
};

// --- Main Component ---
const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [viewMode, setViewMode] = useState("table");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Fetch complaints from backend
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await API.get("/my");
        console.log("Fetched complaints:", res.data);
        setComplaints(Array.isArray(res.data) ? res.data : res.data.complaints || []);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      }
    };

    fetchComplaints();
  }, []);

  // --- Filtering Logic ---
  const filteredComplaints = useMemo(() => {
    return complaints
      .filter(
        (complaint) =>
          filterStatus === "all" || complaint.status === filterStatus
      )
      .filter((complaint) => {
        const lowerSearch = searchTerm.toLowerCase();
        return (
          complaint.title?.toLowerCase().includes(lowerSearch) ||
          complaint._id?.toLowerCase().includes(lowerSearch) ||
          complaint.category?.toLowerCase().includes(lowerSearch)
        );
      });
  }, [complaints, filterStatus, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-white">My Complaints</h1>

        <div className="flex flex-col sm:flex-row w-full md:w-auto items-center gap-3">
          {/* Search */}
          <div className="relative w-full sm:w-auto">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search by ID, title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2.5 rounded-lg bg-slate-800/70 border border-slate-700
                         text-sm text-slate-200 placeholder:text-slate-500
                         focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          {/* Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full sm:w-40 px-4 py-2.5 rounded-lg bg-slate-800/70 border border-slate-700
                       text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          {/* Toggle View */}
          <div className="flex bg-slate-800/70 border border-slate-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-md ${
                viewMode === "table"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              } transition-all`}
            >
              <List size={20} />
            </button>
            <button
              onClick={() => setViewMode("card")}
              className={`p-1.5 rounded-md ${
                viewMode === "card"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              } transition-all`}
            >
              <LayoutGrid size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Table or Cards */}
      {viewMode === "table" ? (
        <ComplaintTable complaints={filteredComplaints} />
      ) : (
        <ComplaintCards complaints={filteredComplaints} />
      )}
    </div>
  );
};

// --- Table View ---
const ComplaintTable = ({ complaints }) => (
  <div className="bg-slate-800/70 border border-slate-700 rounded-xl overflow-x-auto">
    <table className="w-full min-w-max text-left text-sm">
      <thead className="border-b border-slate-700/50">
        <tr>
          <th className="p-4 font-semibold text-slate-400">Complaint ID</th>
          <th className="p-4 font-semibold text-slate-400">Title / Category</th>
          <th className="p-4 font-semibold text-slate-400">Department</th>
          <th className="p-4 font-semibold text-slate-400">Date Submitted</th>
          <th className="p-4 font-semibold text-slate-400">Status</th>
          {/* <th className="p-4 font-semibold text-slate-400">Action</th> */}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-700/50">
        {complaints.map((c) => (
          <tr
            key={c._id}
            className="hover:bg-slate-700/30 transition-colors"
          >
            <td className="p-4 font-mono text-xs text-cyan-300">{c._id}</td>
            <td className="p-4">
              <div className="font-medium text-slate-200">{c.title}</div>
              <div className="text-xs text-slate-400">{c.category}</div>
              <div className="text-xs text-slate-500 mt-1 max-w-[350px] line-clamp-3">
  {c.description}
</div>
            </td>
            <td className="p-4 text-slate-300">
              {c.department?.name || "N/A"}
            </td>
            <td className="p-4 text-slate-400">
              {new Date(c.createdAt).toLocaleDateString()}
            </td>
            <td className="p-4">
              <StatusChip status={c.status} />
            </td>
            
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// --- Card View ---
const ComplaintCards = ({ complaints }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {complaints.map((c) => (
      <div
        key={c._id}
        className="bg-slate-800/70 border border-slate-700 rounded-xl p-5
                   transition-all duration-300 hover:border-slate-600 hover:shadow-glow-blue"
      >
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-semibold text-white">{c.title}</h3>
            <p className="text-sm font-medium text-blue-400">{c.category}</p>
          </div>
          <StatusChip status={c.status} />
        </div>

        <div className="space-y-2 text-sm mb-4">
          <div className="text-slate-400 text-sm line-clamp-3">
            {c.description}
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <MapPin size={14} className="text-slate-500" />
            <span>{c.department?.name || "N/A"}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Calendar size={14} className="text-slate-500" />
            <span>Submitted: {new Date(c.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex justify-between items-center border-t border-slate-700/50 pt-4">
          <span className="font-mono text-xs text-cyan-300">{c._id}</span>
          {/* <button className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 font-medium">
            View Details
            <ChevronRight size={16} />
          </button> */}
        </div>
      </div>
    ))}
  </div>
);

export default MyComplaints;
