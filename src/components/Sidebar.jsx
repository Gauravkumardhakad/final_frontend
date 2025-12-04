import React from 'react';
import {
  LayoutDashboard,
  FileText,
  CreditCard,
  Building,
  BarChart2,
  Settings,
  LogOut,
  Grip,
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom'; // ✅ import useNavigate

// Reusable Nav Item Component
const NavItem = ({ icon: Icon, label, to, onClick }) => (
  <div
    onClick={onClick}
    className="cursor-pointer"
  >
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${
          isActive
            ? 'bg-blue-600/30 text-blue-300 border-l-4 border-blue-400'
            : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
        }`
      }
    >
      <Icon size={20} />
      <span className="ml-4 font-medium">{label}</span>
    </NavLink>
  </div>
);

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 🧹 Clear stored user data
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    // 🧭 Redirect to login page
    navigate("/login");

    // Optionally: show feedback
    // alert("You have been logged out.");
  };

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", to: "/admin/admin-dashboard" },
    { icon: FileText, label: "Complaints", to: "/admin/complaints" },
    // { icon: CreditCard, label: "Payments", to: "/payments" },
    { icon: Building, label: "Departments", to: "/admin/departments" },
    { icon: BarChart2, label: "Reports", to: "/admin/admin-reports" },
    // { icon: Settings, label: "Settings", to: "/admin-settings" },
  ];

  return (
    <aside className="w-64 h-screen sticky top-0 flex flex-col bg-slate-900/80 backdrop-blur-lg border-r border-slate-700/50 shadow-lg">
      {/* Logo */}
      <div className="flex items-center justify-center p-6 border-b border-slate-700/50">
        <Grip size={28} className="text-cyan-400" />
        <h1 className="ml-2 text-xl font-bold text-white">e-Gov Portal</h1>
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

      {/* ✅ Logout Button */}
      <div className="p-4 border-t border-slate-700/50">
        <button
          onClick={handleLogout}
          className="flex items-center w-full p-3 rounded-lg text-slate-300 hover:bg-red-600/30 hover:text-red-400 transition-colors duration-200"
        >
          <LogOut size={20} />
          <span className="ml-4 font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
