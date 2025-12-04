// src/components/CitizenNavbar.jsx
import React, { useState, useEffect } from "react";
import { Bell, Search, ChevronDown } from "lucide-react";
import API from "../api/axios";

const CitizenNavbar = () => {
  const [user, setUser] = useState(null);

  // Fetch logged-in user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/user/me");
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    };
    fetchUser();
  }, []);

  return (
    <header className="sticky top-0 z-10 w-full bg-slate-900/60 backdrop-blur-md border-b border-slate-700/50">
      <div className="flex items-center justify-between h-16 px-6 lg:px-8">
        {/* System Title */}
        <div>
          <h2 className="text-lg font-semibold text-white hidden sm:block">
            Citizen e-Governance Dashboard
          </h2>
        </div>

        {/* Search + Profile */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search..."
              className="w-40 sm:w-64 pl-10 pr-4 py-2 rounded-full bg-slate-800/70 border border-slate-700
                         text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
          </div>

          {/* Notifications */}
          <button className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors">
            <Bell size={20} />
          </button>

          {/* User Info */}
          {user ? (
            <div className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-slate-700/50">
              <img
                src={user.avatar || "https://i.pravatar.cc/40"}
                alt="User Avatar"
                className="w-8 h-8 rounded-full border-2 border-cyan-500"
              />
              <div className="hidden md:block">
                <span className="text-sm font-medium text-white">{user.name}</span>
                <span className="block text-xs text-cyan-400 capitalize">
                  {user.role}
                </span>
              </div>
              <ChevronDown size={16} className="text-slate-400 hidden md:block" />
            </div>
          ) : (
            <div className="text-slate-400 text-sm italic">Loading...</div>
          )}
        </div>
      </div>
    </header>
  );
};

export default CitizenNavbar;
