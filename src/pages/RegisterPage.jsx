import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "https://lead-management-backend-bss2.onrender.com/api";
//const API_URL = "http://localhost:8080/api";

const RegisterPage = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
		// local and hosted backend
      
	  await axios.post(`${API_URL}/register`, formData);
      alert("Registration successful! You can now log in.");
      navigate("/login"); // Redirect to login page
    } catch (err) {
      
		if (err.response && err.response.data) {
		setError(err.response.data); // Show specific backend error
		} 	else {
		setError("An error occurred. Please try again.");
    }
    }
  };

  return (
    <div className="p-6 border rounded-md shadow-md w-80 mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Register</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 active:bg-green-700 active:scale-95 transition transform duration-150 w-full">
          Register
        </button>
      </form>
      <p className="mt-4 text-sm">
        Already have an account? <a href="/login" className="text-blue-500">Login here</a>
      </p>
    </div>
  );
};

export default RegisterPage;
