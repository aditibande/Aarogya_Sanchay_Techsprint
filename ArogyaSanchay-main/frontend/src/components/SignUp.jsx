import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "migrant", 
    language: "English",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Signup Data:", formData);

    try {
      const payload = { ...formData, role: formData.role.toLowerCase() };
      const res = await api.post("/auth/signup", payload);

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      
      if (formData.role.toLowerCase() === "migrant") {
        navigate("/dashboard");
      } else if (formData.role.toLowerCase() === "govt") {
        navigate("/government-dashboard");
      } else {
        navigate("/home");
      }
    } catch (err) {
      console.error("Signup failed:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Signup failed. Try again!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-2 text-center">Create Account</h2>
        <p className="text-gray-600 text-center mb-6">
          Sign up to create your account
        </p>

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          type="text"
          name="name"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 mb-4 border rounded"
          required
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-3 py-2 mb-4 border rounded"
          required
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          name="phone"
          placeholder="Enter your phone number"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-3 py-2 mb-4 border rounded"
          required
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-3 py-2 mb-4 border rounded"
          required
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Role
        </label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-3 py-2 mb-4 border rounded"
        >
          <option value="migrant">Migrant</option>
          <option value="govt">Government</option>
        </select>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
