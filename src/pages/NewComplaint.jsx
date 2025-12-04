// src/components/NewComplaintPage.jsx
import React, { useState ,useEffect} from 'react';
import { Upload, CheckCircle } from 'lucide-react';
import API from '../api/axios'; 

// --- Reusable Form Inputs ---
const FormInput = ({ id, label, type = 'text', ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-2">
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

const FormSelect = ({ id, label, children, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-2">
      {label}
    </label>
    <select
      id={id}
      className="w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border border-slate-700
                 text-slate-200 appearance-none
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                 transition-all duration-200"
      {...props}
    >
      {children}
    </select>
  </div>
);

const FormTextarea = ({ id, label, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-2">
      {label}
    </label>
    <textarea
      id={id}
      rows="4"
      className="w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border border-slate-700
                 text-slate-200 placeholder:text-slate-500
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                 transition-all duration-200 resize-none"
      {...props}
    ></textarea>
  </div>
);

// --- Main Page Component ---
const NewComplaint = () => {
  const [submitted, setSubmitted] = useState(false);
  const [complaintId, setComplaintId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ local state for inputs
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [department, setDepartment] = useState("");
 // const [imageFile, setImageFile] = useState(null);
  const [departments, setDepartments] = useState([]);

  //get the departments
      useEffect(() => {
        const fetchDepartments = async () => {
          try {
            const res = await API.get("/admin/departments");
            console.log(res);
            setDepartments(res.data.departments || []); // expect array
          } catch (err) {
            console.error("Error loading departments:", err);
          }
        };
        fetchDepartments();
      }, []);


  // ✅ UPDATED handleSubmit — connected to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("department", department);
     // if (imageFile) formData.append("image", imageFile);

      


      // to fetch the complaints
      const res = await API.post("/complaints", formData, {
        headers: { "Content-Type": "application/json" }
      });

      console.log("Complaint created:", res.data);
      setComplaintId(res.data.complaint?._id);
      setSubmitted(true);

      // Reset form fields
      setTitle("");
      setDescription("");
      setCategory("");
      setDepartment("");
      //setImageFile(null);
    } catch (err) {
      console.error("Error creating complaint:", err);
      setError(
        err.response?.data?.message ||
        "Failed to submit complaint. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setComplaintId(null);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-dark-start to-dark-end text-slate-200 font-sans p-4 sm:p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-slate-800/70 backdrop-blur-lg border border-slate-700/50 rounded-xl shadow-2xl overflow-hidden">
        <div className="p-6 sm:p-8">

          {/* ✅ Show success screen or form */}
          {submitted ? (
            <div className="text-center py-12 px-6">
              <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6 shadow-glow-green rounded-full" />
              <h2 className="text-3xl font-bold text-white mb-3">Complaint Filed Successfully!</h2>
              <p className="text-lg text-slate-300 mb-6">
                Your Complaint ID is:
                <span className="font-mono font-bold text-cyan-300 ml-2">{complaintId}</span>
              </p>
              <p className="text-slate-400 mb-8">
                You can track it in the “My Complaints” section.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-white
                             bg-blue-600 hover:bg-blue-700 transition-all duration-300
                             shadow-md shadow-blue-600/30 hover:shadow-lg hover:shadow-blue-600/50"
                >
                  File Another Complaint
                </button>
                <a
                  href="/citizen/my-complaints"
                  className="w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-cyan-300
                             bg-slate-700/50 hover:bg-slate-700 transition-all duration-300 text-center"
                >
                  View My Complaints
                </a>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white">File a New Complaint</h1>
                <p className="text-slate-400 mt-2">Please provide the details of your issue.</p>
              </div>

              {/* ✅ Form */}
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">

                  <FormInput
                    id="complaint-title"
                    label="Complaint Title"
                    placeholder="e.g., Broken streetlight on Main St."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />

                  <FormTextarea
                    id="description"
                    label="Description"
                    placeholder="Please describe the issue in detail..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormSelect
                      id="category"
                      label="Category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="Water Supply">Water Supply</option>
                      <option value="Electricity">Electricity</option>
                      <option value="Roads & Infrastructure">Roads & Infrastructure</option>
                      <option value="Sanitation & Waste">Sanitation & Waste</option>
                      <option value="Other">Other</option>
                    </FormSelect>

                    <FormSelect
                      id="department"
                      label="Department"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      required
                    >
                      <option value="">Select a department</option>

                      {departments.map((dep) => (
                        <option key={dep._id} value={dep._id}>
                          {dep.name}
                        </option>
                      ))}
                    </FormSelect>

                  </div>

                  

                  {/* Error message */}
                  {error && (
                    <p className="text-red-400 text-sm text-center font-medium">
                      {error}
                    </p>
                  )}

                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full px-6 py-3 rounded-lg font-semibold text-white
                                  ${loading ? 'bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'}
                                  transition-all duration-300 shadow-md shadow-blue-600/30
                                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                    >
                      {loading ? "Submitting..." : "Submit Complaint"}
                    </button>
                  </div>
                </div>
              </form>

              <div className="text-center mt-6">
                <a
                  href="/citizen/my-complaints"
                  className="text-sm text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
                >
                  View My Complaints
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewComplaint;
