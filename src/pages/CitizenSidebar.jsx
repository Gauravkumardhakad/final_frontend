// src/components/CitizenSidebar.jsx
import React from "react";
import {
  Home,
  FileText,
  PlusCircle,
  User,
  CreditCard,
  LogOut,
  Grip,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const NavItem = ({ icon: Icon, label, to }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      `flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors duration-200 ${
        isActive
          ? "bg-cyan-600/30 text-cyan-300 border-l-4 border-cyan-400"
          : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
      }`
    }
  >
    <Icon size={20} />
    <span className="ml-4 font-medium">{label}</span>
  </NavLink>
);

const CitizenSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navItems = [
    { icon: Home, label: "Dashboard", to: "/citizen/citizen-dashboard" },
    { icon: FileText, label: "My Complaints", to: "/citizen/my-complaints" },
    { icon: PlusCircle, label: "New Complaint", to: "/citizen/new-complaint" },
    // { icon: CreditCard, label: "Payments", to: "/citizen/payments" },
    { icon: User, label: "Profile", to: "/citizen/citizen-profile" },
  ];

  return (
    <aside className="w-64 h-screen sticky top-0 flex flex-col bg-slate-900/80 backdrop-blur-lg border-r border-slate-700/50 shadow-lg">
      {/* Logo */}
      <div className="flex items-center justify-center p-6 border-b border-slate-700/50">
        <Grip size={28} className="text-cyan-400" />
        <h1 className="ml-2 text-xl font-bold text-white">Citizen Portal</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul>
          {navItems.map((item) => (
            <li key={item.label}>
              <NavItem icon={item.icon} label={item.label} to={item.to} />
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-700/50">
        <button
          onClick={handleLogout}
          className="flex items-center w-full p-3 text-left rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={20} />
          <span className="ml-4 font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default CitizenSidebar;
