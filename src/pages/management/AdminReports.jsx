import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FileText, CheckCircle, AlertCircle, Users, ChevronDown } from 'lucide-react';
import { useEffect, useState } from "react";

import API from '../../api/axios'


// Styled Select (for date range)
const Select = ({ children, className, ...props }) => (
  <div className="relative">
    <select
      className={`appearance-none w-full sm:w-auto bg-slate-800 border border-slate-700 text-slate-200 rounded-md py-2 px-3 pl-4 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
      {...props}
    >
      {children}
    </select>
    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
  </div>
);

// Styled Table Components
const Table = React.forwardRef(({ className, ...props }, ref) => (
  <div className="w-full overflow-auto">
    <table ref={ref} className={`w-full caption-bottom text-sm ${className}`} {...props} />
  </div>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
  <thead ref={ref} className={`[&_tr]:border-b [&_tr]:border-slate-700 ${className}`} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef(({ className, ...props }, ref) => (
  <tbody ref={ref} className={`[&_tr:last-child]:border-0 ${className}`} {...props} />
));
TableBody.displayName = "TableBody";

const TableRow = React.forwardRef(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={`border-b border-slate-800 transition-colors hover:bg-slate-800/50 data-[state=selected]:bg-slate-800 ${className}`}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={`h-12 px-4 text-left align-middle font-medium text-slate-400 [&:has([role=checkbox])]:pr-0 ${className}`}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef(({ className, ...props }, ref) => (
  <td ref={ref} className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`} {...props} />
));
TableCell.displayName = "TableCell";

// --- Status Badge Component ---
const StatusBadge = ({ status }) => {
  let colorClasses = '';
  switch (status.toLowerCase()) {
    case 'resolved':
      colorClasses = 'bg-green-500/20 text-green-400 border border-green-500/30';
      break;
    case 'pending':
      colorClasses = 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
      break;
    case 'in-progress':
      colorClasses = 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      break;
    default:
      colorClasses = 'bg-slate-600/20 text-slate-400 border border-slate-600/30';
  }
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses}`}>
      {status}
    </span>
  );
};



// --- Main Reports Page Component ---

export default function AdminReports() {
  const [kpi, setKpi] = useState(null);
  const [complaintsByDept, setComplaintsByDept] = useState([]);
  const [trend, setTrend] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [kpiRes, deptRes, trendRes, recentRes] = await Promise.all([
          API.get("/admin/stats"),
          API.get("/admin/complaints/summary"),
          API.get("/admin/complaints/trends"),
          API.get("/admin/recent-complaints"),
        ]);

        setKpi(kpiRes.data.stats);
        setComplaintsByDept(deptRes.data);
        setTrend(trendRes.data);
        setRecent(recentRes.data);
      } catch (err) {
        console.error("Error loading reports:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 p-3 rounded-lg shadow-lg">
          <p className="text-sm font-semibold text-slate-200">{label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom Recharts Legend
  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <ul className="flex justify-center gap-4 mt-2">
        {payload.map((entry, index) => (
          <li key={`item-${index}`} className="flex items-center text-sm text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: entry.color }} />
            {entry.value.charAt(0).toUpperCase() + entry.value.slice(1)}
          </li>
        ))}
      </ul>
    );
  };

  // Before the return statement
const kpiData = kpi ? [
  {
    title: "Total Complaints",
    value: kpi.totalComplaints || 0,
    icon: <FileText className="w-6 h-6 text-blue-400" />,
    glowColor: "shadow-blue-500/30",
  },
  {
    title: "Resolved Complaints",
    value: kpi.resolvedComplaints || 0,
    icon: <CheckCircle className="w-6 h-6 text-green-400" />,
    glowColor: "shadow-green-500/30",
  },
  {
    title: "Pending Complaints",
    value: kpi.pendingComplaints || 0,
    icon: <AlertCircle className="w-6 h-6 text-yellow-400" />,
    glowColor: "shadow-yellow-500/30",
  },
  {
    title: "Total Registered Users",
    value: kpi.totalUsers || 0,
    icon: <Users className="w-6 h-6 text-cyan-400" />,
    glowColor: "shadow-cyan-500/30",
  },
] : [];


  if (loading)
  return <div className="text-center text-blue-400 mt-10">Loading Reports...</div>;


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-200 p-4 sm:p-6 lg:p-8">
      
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Reports & Analytics</h1>
          <p className="text-base text-slate-400 mt-1">Visual overview of municipal performance metrics.</p>
        </div>
        <Select>
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>Last 90 Days</option>
          <option>Yearly</option>
        </Select>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiData.map((kpi, index) => (
          <div
            key={index}
            className={`bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 shadow-lg ${kpi.glowColor}
                       backdrop-blur-sm transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl`}
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-slate-400">{kpi.title}</span>
              {kpi.icon}
            </div>
            <p className="text-3xl font-extrabold text-white">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* Bar Chart - Complaints by Department */}
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 shadow-lg backdrop-blur-sm">
          <h3 className="text-xl font-semibold text-white mb-4">Complaints by Department</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={complaintsByDept} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorComplaints" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(100, 116, 139, 0.2)' }} />
                <Bar dataKey="complaints" fill="url(#colorComplaints)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart - Resolution Trend */}
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 shadow-lg backdrop-blur-sm">
          <h3 className="text-xl font-semibold text-white mb-4">Complaint Resolution Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend content={renderLegend} />
                <Line type="monotone" dataKey="resolved" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="pending" stroke="#eab308" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Table Section - Recent Complaint Activity */}
      {/* <div className="bg-slate-800/50 p-4 sm:p-6 rounded-xl border border-slate-700/50 shadow-lg backdrop-blur-sm">
        <h3 className="text-xl font-semibold text-white mb-4">Recent Complaint Activity</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden sm:table-cell">Complaint ID</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="hidden md:table-cell">Resolution Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(recent) && recent.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell className="font-medium text-slate-300 hidden sm:table-cell">{activity.id}</TableCell>
                <TableCell className="text-slate-300">{activity.department}</TableCell>
                <TableCell>
                  <StatusBadge status={activity.status} />
                </TableCell>
                <TableCell className="text-slate-400">{activity.date}</TableCell>
                <TableCell className="text-slate-400 hidden md:table-cell">{activity.resolutionTime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div> */}

    </div>
  );
}