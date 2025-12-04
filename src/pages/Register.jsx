import React from 'react';
// We'll use lucide-react for clean, modern icons
import { User, Mail, Lock } from 'lucide-react';
import API from "../api/axios"; 
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { Link } from 'react-router-dom';
/*
  A helper component for the subtle city skyline background accent.
  This is kept separate to make the main App component cleaner.
*/
const CitySkylineBackground = () => (
  <div className="absolute bottom-0 left-0 w-full h-48 opacity-50" style={{ zIndex: 0 }}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 800 200"
      preserveAspectRatio="xMidYMax slice"
    >
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#1e293b', stopOpacity: 0.3 }} />
          <stop offset="100%" style={{ stopColor: '#0f172a', stopOpacity: 0.3 }} />
        </linearGradient>
      </defs>
      <path
        fill="url(#grad)"
        d="M0 200 L0 180 Q 20 160, 40 180 T 80 175 T 120 185 T 160 180 T 200 170 L200 150 L220 150 L220 100 L240 100 L240 150 L250 150 L250 130 L260 130 L260 150 L300 150 L300 160 Q 320 150, 340 160 T 380 165 T 420 175 T 460 170 L460 140 L480 140 L480 80 L500 80 L500 140 L520 140 L520 160 L560 160 L560 120 L580 120 L580 160 L620 160 Q 640 155, 660 160 T 700 170 T 740 180 T 780 175 L800 180 L800 200 Z"
      />
    </svg>
  </div>
);

/*
  A reusable InputField component to keep the form clean.
*/
const InputField = ({ id, type, placeholder, icon, onChange }) => {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
        {icon}
      </span>
      <input
        onChange={onChange}
        type={type}
        id={id}
        name={id}
        required
        className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-lg py-3 px-4 pl-10 focus:border-transparent input-glow placeholder-slate-400 transition duration-200"
        placeholder={placeholder}
      />
    </div>
  );
};

/*
  Main App Component
  This renders the complete signup page.
*/
export default function Register() {

  const navigate = useNavigate();
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    role: ""
    
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.role) {
      setError("Please select a role.");
      return;
    }

    try {
      setLoading(true);
      const res = await API.post("/auth/register", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("role", res.data.user.role);

      // Redirect based on role
      if (res.data.user.role === "admin") {
        navigate("/admin/admin-dashboard");
      } else {
        navigate("/citizen/citizen-dashboard");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };
    
  return (
    <>
      {/* This style block is necessary in a single-file component 
        to import fonts and define custom focus styles.
      */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
        }

        /* Custom focus glow */
        .input-glow:focus {
          outline: none;
          border-color: #3b82f6; /* blue-500 */
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
        }

        /* Custom checkbox color */
        .form-checkbox {
          accent-color: #3b82f6; /* blue-600 */
        }
      `}</style>

      {/* Main container with background gradient */}
      <div className="relative flex items-center justify-center min-h-screen w-screen p-4 overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 text-slate-200 font-sans">
        
        {/* Background SVG Accent */}
        <CitySkylineBackground />

        {/* Signup Card */}
        <div className="relative z-10 w-full max-w-md p-8 sm:p-12 bg-slate-800/60 backdrop-blur-lg border border-slate-700/50 rounded-2xl shadow-2xl shadow-slate-900/50">
          
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Create Your Account</h1>
            <p className="text-slate-300">Register for the e-Governance Portal</p>
          </div>
          
          {/* Signup Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            
            <InputField
              id="name"
              type="text"
              placeholder="Full Name"
              icon={<User size={20} />}
              onChange={handleChange}
            />

            <InputField
              id="email"
              type="email"
              placeholder="Email Address"
              icon={<Mail size={20} />}
              onChange={handleChange}
            />

            <InputField
              id="password"
              type="password"
              placeholder="Password"
              icon={<Lock size={20} />}
              onChange={handleChange}
            />

            

           <div>
            <label htmlFor="role" className="block text-sm text-slate-300 mb-2">Select Your Role</label>
            <select
              id="role"
              name="role"
              onChange={handleChange}
              value={form.role}
              required
              className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-lg py-3 px-4 focus:border-transparent input-glow placeholder-slate-400"
            >
              <option value="" disabled>Please select a role...</option>
              <option value="citizen">Citizen</option>
              <option value="admin">Municipal Official</option> 
            </select>
          </div>

            {/* Signup Button */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg shadow-blue-600/30 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500 transition-all duration-300 transform hover:-translate-y-0.5"
                
              >
                Create Account
              </button>
            </div>

            {/* Login Link */}
            <p className="text-sm text-center text-slate-300">
              Already have an account?{' '}
              <Link to='/login' className="font-medium text-blue-400 hover:underline">
                Login here
              </Link>
            </p>

          </form>
        </div>
      </div>
    </>
  );
}