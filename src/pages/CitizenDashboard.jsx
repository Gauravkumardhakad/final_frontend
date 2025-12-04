// src/components/CitizenDashboard.jsx
import React from 'react';
import {
  FileText,
  FileWarning,
  FileCheck2,
  PlusCircle,
  CreditCard,
  Bell,
  ArrowRight,
} from 'lucide-react';
import { useState,useEffect } from 'react';
import API from '../api/axios';

// --- Helper Components ---

// Status Chip
const StatusChip = ({ status }) => {
  const baseStyle = 'rounded-full px-3 py-1 text-xs font-medium shadow-md capitalize';
  
  switch (status) {
    case 'Pending':
      return <span className={`${baseStyle} bg-yellow-500/20 text-yellow-300 shadow-yellow-500/20`}>{status}</span>;
    case 'Resolved':
      return <span className={`${baseStyle} bg-green-500/20 text-green-300 shadow-green-500/20`}>{status}</span>;
    case 'In Progress':
      return <span className={`${baseStyle} bg-blue-500/20 text-blue-300 shadow-blue-500/20`}>{status}</span>;
    default:
      return <span className={`${baseStyle} bg-slate-600/20 text-slate-300`}>{status}</span>;
  }
};

// Stat Card
const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className={`bg-slate-800/70 border border-slate-700 rounded-xl p-5 
                 transition-all duration-300 hover:border-slate-600 ${colorClass.hoverShadow}`}>
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

// Action Card
const ActionCard = ({ title, description, icon: Icon, href = "#" }) => (
  <a
    href={href}
    className="group bg-slate-800/70 border border-slate-700 rounded-xl p-5
               flex items-center gap-4 transition-all duration-300
               hover:bg-slate-700/50 hover:shadow-glow-cyan"
  >
    <div className="p-3 rounded-full bg-cyan-500/10 text-cyan-400
                    transition-all duration-300 group-hover:scale-110">
      <Icon size={24} />
    </div>
    <div>
      <h4 className="text-lg font-semibold text-white">{title}</h4>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
    <ArrowRight size={20} className="ml-auto text-slate-500 transition-transform duration-300 group-hover:translate-x-1" />
  </a>
);

// --- Main Dashboard Component ---
const CitizenDashboard = () => {
  const [summary, setSummary] = useState({ total: 0, pending: 0, resolved: 0 });
  const [complaints, setComplaints] = useState([]);
  const [user, setUser] = useState(null);

  // Fetch all data when page loads
  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ Fetch summary
        const summaryRes = await API.get("/my/summary");
        console.log(summaryRes.data);
        setSummary({
          total: summaryRes.data.totalComplaints || 0,
          pending: summaryRes.data.pending || 0,
          resolved: summaryRes.data.resolved || 0,
        });

        //✅ Fetch complaints
        const complaintRes = await API.get("/my");
        console.log(complaintRes.data);
        setComplaints(complaintRes.data.complaints?.slice(0, 5) || []);


        // ✅ Fetch user info
        const userRes = await API.get("/user/me");
        console.log(userRes.data);
        setUser(userRes.data.user);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchData();
  }, []);
  
  return (
    <div className="space-y-8">
      {/* --- Greeting --- */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Welcome back, {user?.name || "Citizen"}!
        </h1>
        <p className="text-lg text-slate-400 mt-1">
          Here's a summary of your recent activity and services.
        </p>
      </div>

      {/* --- Stats --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Complaints"
          value={summary.total}
          icon={FileText}
          colorClass={{
            text: "text-cyan-400",
            bg: "bg-cyan-500/10",
            hoverShadow: "hover:shadow-glow-cyan",
          }}
        />
        <StatCard
          title="Pending Complaints"
          value={summary.pending}
          icon={FileWarning}
          colorClass={{
            text: "text-yellow-400",
            bg: "bg-yellow-500/10",
            hoverShadow: "hover:shadow-glow-yellow",
          }}
        />
        <StatCard
          title="Resolved Complaints"
          value={summary.resolved}
          icon={FileCheck2}
          colorClass={{
            text: "text-green-400",
            bg: "bg-green-500/10",
            hoverShadow: "hover:shadow-glow-green",
          }}
        />
      </div>

      {/* --- Main Grid --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Complaints */}
        <div className="lg:col-span-2 bg-slate-800/70 border border-slate-700 rounded-xl">
          <h3 className="text-lg font-semibold text-white p-4 border-b border-slate-700/50">
            Recent Complaints
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-max text-left text-sm">
              <thead className="border-b border-slate-700/50">
                <tr>
                  <th className="p-4 font-semibold text-slate-400">Title</th>
                  <th className="p-4 font-semibold text-slate-400">Department</th>
                  <th className="p-4 font-semibold text-slate-400">Date</th>
                  <th className="p-4 font-semibold text-slate-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {complaints.map((c) => (
                  <tr
                    key={c._id}
                    className="hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-medium text-slate-200">
                        {c.title}
                      </div>
                      <div className="text-xs text-cyan-400 font-mono mt-1">
                        {c._id}
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
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
          <div className="space-y-4">
            <ActionCard
              title="File a New Complaint"
              description="Report an issue or a problem."
              icon={PlusCircle}
              href="/citizen/new-complaint"
            />
            <ActionCard
              title="View Notifications"
              description="Check updates on your requests."
              icon={Bell}
              href="/citizen/notifications"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;