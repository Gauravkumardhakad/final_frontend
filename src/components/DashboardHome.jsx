// src/components/DashboardHome.jsx
import React from 'react';
import { useState,useEffect } from 'react';
import { Users, FileWarning, FileCheck2, Landmark } from 'lucide-react';
import StatCard from './StatCard';
import RecentComplaintsTable from './RecentComplaintsTable';
import Charts from './Charts';
import API from '../api/axios'

const DashboardHome = () => {

  const [stats, setStats] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, complaintsRes] = await Promise.all([
          API.get("/admin/stats"),
          API.get("/admin/recent-complaints"),
        ]);
        setStats(statsRes.data.stats);
        setComplaints(complaintsRes.data.complaints);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-blue-400">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-400">
        {error}
      </div>
    );
  }


  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={Users}
          accentColor="blue"
        />
        <StatCard
          title="Pending Complaints"
          value={stats?.pendingComplaints || 0}
          icon={FileWarning}
          accentColor="yellow"
        />
        <StatCard
          title="Resolved Complaints"
          value={stats?.resolvedComplaints || 0}
          icon={FileCheck2}
          accentColor="green"
        />
        <StatCard
          title="Revenue Collected"
          value={`₹${stats?.revenueCollected?.toLocaleString() || 0}`}
          icon={Landmark}
          accentColor="cyan"
        />
      </div>

      {/* Charts & Recent Complaints */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Charts complaints={complaints} />
        </div>
        <div className="lg:col-span-1">
          <RecentComplaintsTable complaints={complaints} />
        </div>
      </div>
    </div>
  );
};


export default DashboardHome;