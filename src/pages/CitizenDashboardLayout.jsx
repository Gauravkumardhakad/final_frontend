import React from "react";
import CitizenSidebar from "./CitizenSidebar";
import CitizenNavbar from "./CitizenNavbar";
import { Outlet } from "react-router-dom";

const CitizenDashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      {/* Citizen Sidebar */}
      <CitizenSidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        <CitizenNavbar />
        <main className="p-6 flex-1 overflow-auto">
          <Outlet /> {/* 👈 Citizen pages will render here */}
        </main>
      </div>
    </div>
  );
};

export default CitizenDashboardLayout;
