// src/components/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import {
  User,
  Settings,
  LogOut,
  Edit2,
  Save,
  X,
  Lock,
} from "lucide-react";
import API from "../api/axios"; // ✅ import axios instance
import { useNavigate } from "react-router-dom";

// Reusable Input for password section
const FormInput = ({ id, label, type = "password", ...props }) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-slate-300 mb-2"
    >
      {label}
    </label>
    <input
      type={type}
      id={id}
      className="w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border border-slate-700
                 text-slate-200 placeholder:text-slate-500
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                 transition-all duration-200"
      {...props}
    />
  </div>
);

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [form, setForm] = useState({});
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Fetch user data from backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/user/me");
        setUserData(res.data);
        setForm(res.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await API.put("/user/update", form);
      setUserData(res.data.user);
      setIsEditing(false);
      alert("Profile updated successfully ✅");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile ❌");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword)
      return alert("New passwords do not match!");

    try {
      setLoading(true);
      const res = await API.put("/user/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      alert("Password updated successfully ✅");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to update password ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!userData)
    return <p className="text-slate-400 italic">Loading profile...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Details */}
          {activeTab === "profile" && (
            <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-center border-b border-slate-700/50 pb-4 mb-4">
                <div className="flex items-center gap-4">
                  <img
                    src={userData.avatar || "https://i.pravatar.cc/150"}
                    alt="avatar"
                    className="w-16 h-16 rounded-full border-4 border-cyan-500"
                  />
                  <div>
                    <h2 className="text-xl font-bold text-white">{userData.name}</h2>
                    <p className="text-sm text-slate-400">{userData.email}</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 ${
                    isEditing
                      ? "bg-red-600/20 text-red-300 hover:bg-red-600/40"
                      : "bg-blue-600/20 text-blue-300 hover:bg-blue-600/40"
                  } transition-all`}
                >
                  {isEditing ? <X size={16} /> : <Edit2 size={16} />}
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              {/* Editable fields */}
              <div className="space-y-5">
                {["name", "email", "phone", "address"].map((field) => (
                  <div key={field}>
                    <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">
                      {field}
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name={field}
                        value={form[field] || ""}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900/50 border border-slate-700 text-slate-200 focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-lg text-slate-200 font-medium">
                        {userData[field]}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {isEditing && (
                <div className="text-right mt-6 border-t border-slate-700/50 pt-4">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-6 py-2.5 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all flex items-center gap-2 ml-auto"
                  >
                    <Save size={18} />
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Change Password */}
          {activeTab === "settings" && (
            <div className="bg-slate-800/70 border border-slate-700 rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 border-b border-slate-700/50 pb-4 mb-4">
                <Lock size={20} className="text-cyan-400" />
                <h2 className="text-xl font-semibold text-white">
                  Change Password
                </h2>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-5">
                <FormInput
                  id="currentPassword"
                  label="Current Password"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      currentPassword: e.target.value,
                    })
                  }
                />
                <FormInput
                  id="newPassword"
                  label="New Password"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value,
                    })
                  }
                />
                <FormInput
                  id="confirmPassword"
                  label="Confirm New Password"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmPassword: e.target.value,
                    })
                  }
                />

                <div className="text-right border-t border-slate-700/50 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all"
                  >
                    {loading ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
