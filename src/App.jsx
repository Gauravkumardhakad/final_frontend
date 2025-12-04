
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import your page components
import Login from './pages/Login';
import Register from './pages/Register';
import CitizenDashboard from './pages/CitizenDashboard';
import MyComplaints from './pages/MyComplaints';
import NewComplaint from './pages/NewComplaint';
import DashboardHome from './components/DashboardHome';
import DashboardLayout from './components/DashboardLayout';
import AdminComplaintManagement from './pages/management/AdminComplaintManagement'
import AdminDepartmentManagement from './pages/management/AdminDepartmentManagement'
import AdminReports from './pages/management/AdminReports';
import AdminSetting from './pages/management/AdminSetting';
import CitizenDashboardLayout from './pages/CitizenDashboardLayout';
import ProfilePage from './pages/ProfilePage';
// ... import other pages

function App() {
  return (
    // You can add a Navbar or Layout component here if it's on every page
    
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/" element={< Login/>} /> 

      {/* Citizen Routes */}
      <Route path='/citizen' element={<CitizenDashboardLayout/>}>
        <Route path="citizen-dashboard" element={<CitizenDashboard />} />
        <Route path="my-complaints" element={<MyComplaints />} />
        <Route path="new-complaint" element={<NewComplaint />} />
        <Route path='citizen-profile' element={<ProfilePage/>}/>
      </Route>
      

      {/* Admin Routes */}
       <Route path="/admin" element={<DashboardLayout />}>
          <Route path="admin-dashboard" element={<DashboardHome />} />
          <Route path="complaints" element={<AdminComplaintManagement />} />
          <Route path="departments" element={<AdminDepartmentManagement />} />
          {/* <Route path="admin-settings" element={<AdminSetting />} /> */}
          <Route path="admin-reports" element={<AdminReports />} />
        </Route>

      {/* Add a default/fallback route */}
      
    </Routes>
  );
}

export default App;