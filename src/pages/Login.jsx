import React from 'react';
import { EmailIcon } from '../utils/EmailIcon';
import { LockIcon } from '../utils/LockIcon';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import API from '../api/axios';

export default function Login() {
  
  const navigate = useNavigate();

  // 1. State for form data, errors, and loading
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError(''); // Clear previous errors
    setLoading(true); // Set loading state

    try {
      // Send data to the backend login endpoint
      const res = await API.post('/auth/login', formData);

      // Save token and user data from response
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // Redirect based on user role
      if (res.data.user.role === 'admin') {
        navigate('/admin/admin-dashboard');
      } else {
        navigate('/citizen/citizen-dashboard');
      }
    } catch (err) {
      // Handle login errors
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false); // Stop loading state
    }
  };
  
  return (
    // Page wrapper with gradient background
    <div className="min-h-screen w-screen bg-gradient-to-br from-slate-900 to-slate-800 text-gray-200 font-[Inter] flex items-center justify-center p-4">
      
      {/* Login Card */}
      <div className="w-full max-w-md bg-slate-800/60 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-8 border border-slate-700/50">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Municipal e-Governance</h1>
          <p className="text-slate-300 text-sm">System Login</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Email Field */}
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              {/* Icon */}
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EmailIcon />
              </div>
              {/* Input */}
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="you@example.gov"
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Password
            </label>
            <div className="relative">
              {/* Icon */}
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockIcon />
              </div>
              {/* Input */}
              <input
                type="password"
                id="password"
                name="password"
                required
                placeholder="••••••••"
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg shadow-lg shadow-blue-600/20 
                         hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-500/30 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 
                         transition-all duration-300 ease-in-out"
            >
              Login
            </button>
          </div>
        </form>

        {/* Registration Link */}
        <div className="text-center text-sm text-slate-400 mt-8">
          Don't have an account?
          <Link to='/register' href="#" className="font-medium text-sky-400 hover:text-sky-300 transition-colors duration-300 ml-1">
            Register here
          </Link>
        </div>
        
      </div>
    </div>
  );
}