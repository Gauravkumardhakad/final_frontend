// src/components/AdminDepartmentManagement.jsx
import React, { useState, useMemo, useEffect } from 'react';
import {
  Building,
  Users,
  FileWarning,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Mail,
  Phone,
  BarChart,
  Save,
} from 'lucide-react';

import API from '../../api/axios'

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

// --- Reusable Form Input ---
const FormInput = ({ id, label, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-2">
      {label}
    </label>
    <input
      id={id}
      className="w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border border-slate-700
                 text-slate-200 placeholder:text-slate-500
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                 transition-all duration-200"
      {...props}
    />
  </div>
);

// --- Add/Edit Modal ---
const DepartmentModal = ({ isOpen, onClose, onSave, mode, departmentData }) => {
  const [formData, setFormData] = useState({
    name: '', head: '', email: '', phone: '', description: ''
  });

  useEffect(() => {
    // Populate form when in 'edit' mode
    if (isOpen && mode === 'edit' && departmentData) {
      setFormData(departmentData);
    } 
    // Reset form when opening in 'add' mode
    else if (isOpen && mode === 'add') {
      setFormData({ name: '', head: '', email: '', phone: '', description: '' });
    }
  }, [isOpen, mode, departmentData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-2xl bg-slate-800 border border-slate-700 rounded-xl shadow-2xl shadow-blue-500/10">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-700">
            <h2 className="text-xl font-semibold text-white">
              {mode === 'add' ? 'Add New Department' : 'Edit Department'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Body */}
          <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
            <FormInput
              id="name" name="name" label="Department Name"
              value={formData.name} onChange={handleChange}
              placeholder="e.g., Public Works Dept. (PWD)" required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormInput
                id="head" name="head" label="Department Head"
                value={formData.head} onChange={handleChange}
                placeholder="e.g., Mr. Rajesh Gupta" required
              />
              <FormInput
                id="email" name="email" label="Contact Email"
                value={formData.email} onChange={handleChange}
                type="email" placeholder="e.g., head@gov.in" required
              />
            </div>
            <FormInput
              id="phone" name="phone" label="Contact Phone"
              value={formData.phone} onChange={handleChange}
              type="tel" placeholder="e.g., 9876543210"
            />
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">
                Description
              </label>
              <textarea
                id="description" name="description" rows="3"
                value={formData.description} onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border border-slate-700
                           text-slate-200 placeholder:text-slate-500 resize-none
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Briefly describe the department's responsibilities..."
              ></textarea>
            </div>
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-end gap-4 p-5 border-t border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg font-semibold text-slate-300
                         bg-slate-700/50 hover:bg-slate-700 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg font-semibold text-white
                         bg-blue-600 hover:bg-blue-700 transition-all duration-300 ease-in-out
                         shadow-md shadow-blue-600/30 hover:shadow-lg hover:shadow-blue-600/50
                         flex items-center gap-2"
            >
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// --- Main Page Component ---
const AdminDepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentDepartment, setCurrentDepartment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await API.get("/admin/departments");
        setDepartments(res.data.departments);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch departments.");
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);


  // --- Summary Stats ---
  const summaryStats = useMemo(() => {
    return {
      total: departments.length,
      officials: departments.length, // Assuming 1 head per dept
      complaints: departments.reduce((acc, dept) => acc + dept.complaintCount, 0),
    };
  }, [departments]);

  // --- Filtered Data ---
  const filteredDepartments = useMemo(() => {
    return departments.filter(dept =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.head.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [departments, searchTerm]);

  // --- Handlers ---
  const handleOpenModal = (mode, department = null) => {
    setModalMode(mode);
    setCurrentDepartment(department);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentDepartment(null);
  };

  const handleSaveDepartment = async (formData) => {
    try {
      if (modalMode === "add") {
        const res = await API.post("/admin/departments", formData);
        setDepartments((prev) => [res.data.department, ...prev]);
      } else {
        const res = await API.put(`/admin/departments/${currentDepartment._id}`, formData);
        setDepartments((prev) =>
          prev.map((dept) =>
            dept._id === currentDepartment._id ? res.data.department : dept
          )
        );
      }
      handleCloseModal();
    } catch (err) {
      console.error(err);
      alert("Error saving department");
    }
  };


  const handleDelete = async (id) => {
    console.log(id);
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await API.delete(`/admin/departments/${id}`);
        setDepartments((prev) => prev.filter((dept) => dept._id !== id));
      } catch (err) {
        console.error(err);
        alert("Error deleting department");
      }
    }
  };


  if (loading) return <p className="text-center text-blue-400 mt-10">Loading departments...</p>;
  if (error) return <p className="text-center text-red-400 mt-10">{error}</p>;


  return (
    <>
      <div className="space-y-6">
        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold text-white">Department Management</h1>
          <button
            onClick={() => handleOpenModal('add')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-white
                       bg-blue-600 hover:bg-blue-700 transition-all duration-300 ease-in-out
                       shadow-md shadow-blue-600/30 hover:shadow-lg hover:shadow-blue-600/50"
          >
            <Plus size={18} />
            Add New Department
          </button>
        </div>

        {/* --- Summary Cards --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SummaryCard
            title="Total Departments"
            value={summaryStats.total}
            icon={Building}
            colorClass={{ text: 'text-cyan-400', bg: 'bg-cyan-500/10', shadow: 'shadow-glow-cyan' }}
          />
          <SummaryCard
            title="Total Officials"
            value={summaryStats.officials}
            icon={Users}
            colorClass={{ text: 'text-blue-400', bg: 'bg-blue-500/10', shadow: 'shadow-glow-blue' }}
          />
          <SummaryCard
            title="Assigned Complaints"
            value={summaryStats.complaints}
            icon={FileWarning}
            colorClass={{ text: 'text-yellow-400', bg: 'bg-yellow-500/10', shadow: 'shadow-glow-yellow' }}
          />
        </div>

        {/* --- Main Content --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* --- Department Table --- */}
          <div className="lg:col-span-2 bg-slate-800/70 border border-slate-700 rounded-xl">
            {/* Search Toolbar */}
            <div className="p-4 border-b border-slate-700/50">
              <div className="relative">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name or head..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-900/50 border border-slate-700
                             text-sm text-slate-200 placeholder:text-slate-500
                             focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-max text-left text-sm">
                <thead className="border-b border-slate-700/50">
                  <tr>
                    <th className="p-4 font-semibold text-slate-400">Department Name</th>
                    <th className="p-4 font-semibold text-slate-400">Head</th>
                    <th className="p-4 font-semibold text-slate-400">Contact</th>
                    <th className="p-4 font-semibold text-slate-400">Complaints</th>
                    <th className="p-4 font-semibold text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {filteredDepartments.map((dept) => (
                    <tr key={dept.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="p-4">
                        <div className="font-medium text-slate-200">{dept.name}</div>
                      </td>
                      <td className="p-4 text-slate-300">{dept.head}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Mail size={14} /> {dept.email}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                          <Phone size={14} /> {dept.phone}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full font-medium text-xs
                                         bg-cyan-500/10 text-cyan-300">
                          {dept.complaintCount} Open
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleOpenModal('edit', dept)}
                            className="p-1.5 text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 rounded-full"
                            title="Edit Department"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(dept._id)}
                            className="p-1.5 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-full"
                            title="Delete Department"
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
          </div>

          {/* --- Side Panel (Placeholder) --- */}
          {/* <div className="lg:col-span-1 bg-slate-800/70 border border-slate-700 rounded-xl p-6 h-fit">
            <div className="flex items-center gap-3 mb-4">
              <BarChart className="text-cyan-400" size={20} />
              <h3 className="text-lg font-semibold text-white">Department Performance</h3>
            </div>
            <div className="h-64 flex items-center justify-center text-slate-500">
              [ Chart displaying resolved vs. pending complaints by department ]
            </div>
          </div> */}
        </div>
      </div>

      {/* --- Modal Component Render --- */}
      <DepartmentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveDepartment}
        mode={modalMode}
        departmentData={currentDepartment}
      />
    </>
  );
};

export default AdminDepartmentManagement;