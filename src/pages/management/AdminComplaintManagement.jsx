// src/components/AdminComplaintManagement.jsx
import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Filter,
  ChevronDown,
  Eye,
  Trash2,
  X,
  FileText,
  User,
  Building,
  Calendar,
  Save,
  FileWarning,
  FileCheck2,
  Loader2,
  AlertCircle,
} from 'lucide-react';

import API from '../../api/axios'


// --- Status Chip Component ---
const StatusChip = ({ status }) => {
  const baseStyle = 'rounded-full px-3 py-1 text-xs font-medium shadow-md capitalize';
  
  switch (status) {
    case 'Pending':
      return (
        <span className={`${baseStyle} bg-yellow-500/20 text-yellow-300 shadow-yellow-500/20`}>
          {status}
        </span>
      );
    case 'Resolved':
      return (
        <span className={`${baseStyle} bg-green-500/20 text-green-300 shadow-green-500/20`}>
          {status}
        </span>
      );
    case 'In Progress':
      return (
        <span className={`${baseStyle} bg-blue-500/20 text-blue-300 shadow-blue-500/20`}>
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

// --- Summary Card Component ---
const SummaryCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className={`bg-slate-800/70 border border-slate-700 rounded-xl p-5 
                 transition-all duration-300 hover:border-slate-600 hover:${colorClass.shadow}`}>
    <div className="flex items-center justify-between">
      <div className={`p-3 rounded-full ${colorClass.bg}`}>
        <Icon size={20} className={colorClass.text} />
      </div>
      <div className="text-right">
        <p className="text-3xl font-bold text-white">{value}</p>
        <p className="text-sm font-medium text-slate-400">{title}</p>
      </div>
    </div>
  </div>
);

// --- Main Page Component ---
const AdminComplaintManagement = () => {
  // --- State ---
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    status: 'all',
    department: 'all',
    sort: 'newest',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [modalStatus, setModalStatus] = useState('');

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const res = await API.get("/admin/complaints");
        console.log("complaints for admin= ",res);

        setComplaints(
          res.data.complaints.map((c) => ({
            id: c._id,
            citizen: { name: c.user?.name || "Unknown", email: c.user?.email || "N/A" },
            category: c.category || "General",
            department: c.department?.name || "N/A",
            status: c.status,
            date: new Date(c.createdAt).toISOString().split("T")[0],
            description: c.description,
            image: c.imageUrl || null,
          }))
        );
      } catch (err) {
        console.error(err);
        setError("Failed to fetch complaints. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);


  // --- Calculations ---
  const summaryStats = useMemo(() => {
    return {
      total: complaints.length,
      pending: complaints.filter((c) => c.status === 'Pending').length,
      inProgress: complaints.filter((c) => c.status === 'In Progress').length,
      resolved: complaints.filter((c) => c.status === 'Resolved').length,
    };
  }, [complaints]);

  // --- Memoized Filtering Logic ---
  const filteredComplaints = useMemo(() => {
    let a = [...complaints];
    
    // 1. Filter by Status
    if (filters.status !== 'all') {
      a = a.filter((c) => c.status === filters.status);
    }
    // 2. Filter by Department
    if (filters.department !== 'all') {
      a = a.filter((c) => c.department === filters.department);
    }
    // 3. Filter by Search
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      a = a.filter((c) =>
        c.id.toLowerCase().includes(lowerSearch) ||
        c.citizen.name.toLowerCase().includes(lowerSearch) ||
        c.citizen.email.toLowerCase().includes(lowerSearch) ||
        c.category.toLowerCase().includes(lowerSearch)
      );
    }
    // 4. Sort by Date
    a.sort((c1, c2) => {
      const date1 = new Date(c1.date);
      const date2 = new Date(c2.date);
      return filters.sort === 'newest' ? date2 - date1 : date1 - date2;
    });
    
    return a;
  }, [complaints, filters, searchTerm]);

  // --- Handlers ---
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleViewDetails = (complaint) => {
    setSelectedComplaint(complaint);
    setModalStatus(complaint.status); // Set initial modal status
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedComplaint(null);
    setModalStatus('');
  };

  const handleStatusUpdate = async () => {
    try {
      await API.put(`/admin/complaints/${selectedComplaint.id}/status`, {
        status: modalStatus,
      });

      setComplaints((prev) =>
        prev.map((c) =>
          c.id === selectedComplaint.id ? { ...c, status: modalStatus } : c
        )
      );

      handleCloseModal();
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update complaint status.");
    }
  };


  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this complaint?")) {
      try {
        await API.delete(`/admin/complaints/${id}`);
        setComplaints((prev) => prev.filter((c) => c.id !== id));
      } catch (err) {
        console.error("Error deleting complaint:", err);
        alert("Failed to delete complaint.");
      }
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-blue-400 text-lg">
        Loading complaints...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-400 text-lg">
        {error}
      </div>
    );
  }


  // --- JSX ---
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Complaint Management</h1>

      {/* --- Summary Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard 
          title="Total Complaints" 
          value={summaryStats.total}
          icon={FileText}
          colorClass={{ text: 'text-cyan-400', bg: 'bg-cyan-500/10', shadow: 'shadow-glow-cyan' }}
        />
        <SummaryCard 
          title="Pending" 
          value={summaryStats.pending}
          icon={FileWarning}
          colorClass={{ text: 'text-yellow-400', bg: 'bg-yellow-500/10', shadow: 'shadow-glow-yellow' }}
        />
        <SummaryCard 
          title="In Progress" 
          value={summaryStats.inProgress}
          icon={Loader2}
          colorClass={{ text: 'text-blue-400', bg: 'bg-blue-500/10', shadow: 'shadow-glow-blue' }}
        />
        <SummaryCard 
          title="Resolved" 
          value={summaryStats.resolved}
          icon={FileCheck2}
          colorClass={{ text: 'text-green-400', bg: 'bg-green-500/10', shadow: 'shadow-glow-green' }}
        />
      </div>

      {/* --- Filter/Search Toolbar --- */}
      <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4 flex flex-col md:flex-row items-center gap-4">
        {/* Search Bar */}
        <div className="relative w-full md:flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID, Citizen, or Category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-900/50 border border-slate-700
                       text-sm text-slate-200 placeholder:text-slate-500
                       focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
        {/* Filters */}
        <div className="flex w-full md:w-auto items-center gap-3">
          <Filter size={18} className="text-slate-400" />
          <select
            name="department"
            value={filters.department}
            onChange={handleFilterChange}
            className="flex-1 px-3 py-2.5 rounded-lg bg-slate-900/50 border border-slate-700 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="all">All Departments</option>
            <option value="Public Works Dept. (PWD)">PWD</option>
            <option value="Water Works">Water Works</option>
            <option value="Health & Sanitation">Health & Sanitation</option>
            <option value="Revenue Dept.">Revenue</option>
          </select>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="flex-1 px-3 py-2.5 rounded-lg bg-slate-900/50 border border-slate-700 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
          <select
            name="sort"
            value={filters.sort}
            onChange={handleFilterChange}
            className="flex-1 px-3 py-2.5 rounded-lg bg-slate-900/50 border border-slate-700 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* --- Complaints Table --- */}
      <div className="bg-slate-800/70 border border-slate-700 rounded-xl overflow-x-auto">
        <table className="w-full min-w-max text-left text-sm">
          <thead className="border-b border-slate-700/50">
            <tr>
              <th className="p-4 font-semibold text-slate-400">Complaint ID</th>
              <th className="p-4 font-semibold text-slate-400">Citizen</th>
              <th className="p-4 font-semibold text-slate-400">Category / Dept.</th>
              <th className="p-4 font-semibold text-slate-400">Date Submitted</th>
              <th className="p-4 font-semibold text-slate-400">Status</th>
              <th className="p-4 font-semibold text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {filteredComplaints.map((c) => (
              <tr key={c.id} className="hover:bg-slate-700/30 transition-colors">
                <td className="p-4 font-mono text-xs text-cyan-300">{c.id}</td>
                <td className="p-4">
                  <div className="font-medium text-slate-200">{c.citizen.name}</div>
                  <div className="text-xs text-slate-400">{c.citizen.email}</div>
                </td>
                <td className="p-4">
                  <div className="font-medium text-slate-200">{c.category}</div>
                  <div className="text-xs text-slate-400">{c.department}</div>
                </td>
                <td className="p-4 text-slate-400">{c.date}</td>
                <td className="p-4">
                  <StatusChip status={c.status} />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleViewDetails(c)}
                      className="p-1.5 text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 rounded-full"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="p-1.5 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-full"
                      title="Delete Complaint"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* --- Details Modal --- */}
      {isModalOpen && selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleCloseModal}
          ></div>
          
          {/* Modal Content */}
          <div className="relative z-10 w-full max-w-4xl bg-slate-800 border border-slate-700 rounded-xl shadow-2xl shadow-cyan-500/10">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-700">
              <h2 className="text-xl font-semibold text-white">Complaint Details</h2>
              <button
                onClick={handleCloseModal}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Body */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-5 max-h-[70vh] overflow-y-auto">
              {/* Left Column: Details */}
              <div className="lg:col-span-2 space-y-5">
                <h3 className="text-lg font-semibold text-cyan-300 font-mono">{selectedComplaint.id}</h3>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-400">STATUS</label>
                  <StatusChip status={selectedComplaint.status} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-400">CATEGORY</label>
                  <p className="text-lg text-slate-200">{selectedComplaint.category}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-400">DEPARTMENT</label>
                  <p className="text-lg text-slate-200">{selectedComplaint.department}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-400">DESCRIPTION</label>
                  <p className="text-slate-300 whitespace-pre-wrap">{selectedComplaint.description}</p>
                </div>
                {selectedComplaint.image && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-400">ATTACHED IMAGE</label>
                    <img
                      src={selectedComplaint.image}
                      alt="Complaint attachment"
                      className="w-full h-auto max-w-sm rounded-lg border border-slate-700"
                    />
                  </div>
                )}
              </div>
              
              {/* Right Column: Citizen & Actions */}
              <div className="lg:col-span-1 space-y-6">
                {/* Citizen Info Card */}
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-white mb-3">Citizen Information</h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-slate-200 font-medium">{selectedComplaint.citizen.name}</p>
                    <p className="text-slate-400">{selectedComplaint.citizen.email}</p>
                  </div>
                </div>
                
                {/* Update Status Card */}
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-white mb-3">Update Status</h4>
                  <div className="space-y-3">
                    <select
                      value={modalStatus}
                      onChange={(e) => setModalStatus(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-600
                                 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                    <button
                      onClick={handleStatusUpdate}
                      disabled={modalStatus === selectedComplaint.status}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-white
                                 bg-blue-600 hover:bg-blue-700 transition-all
                                 shadow-md shadow-blue-600/30 hover:shadow-lg hover:shadow-blue-600/50
                                 disabled:bg-slate-600 disabled:shadow-none disabled:cursor-not-allowed"
                    >
                      <Save size={18} />
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminComplaintManagement;