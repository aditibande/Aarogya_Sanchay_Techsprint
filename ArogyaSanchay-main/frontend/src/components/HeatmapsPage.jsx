import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import image from "../assets/Government employee.jpg";
import logo from "../assets/logo.png";
import api from "../api";

export default function HeatmapsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedChart, setSelectedChart] = useState("pie"); 
  const [migrantsData, setMigrantsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState("english");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (["doctor", "admin", "govt"].includes(parsedUser.role)) {
        setUser(parsedUser);
        fetchMigrantsData();
      } else {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchMigrantsData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await api.get("/migrants", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const mappedData = response.data.data.map(migrant => ({
          ...migrant,
          status: getHealthStatus(migrant) 
        }));
        setMigrantsData(mappedData);
      } else {
        setError("Failed to fetch migrants data");
        setMigrantsData(getSampleData());
      }
    } catch (error) {
      console.error("Error fetching migrants data:", error);
      setError("Failed to load migrants data");
      setMigrantsData(getSampleData());
    } finally {
      setLoading(false);
    }
  };

  const getSampleData = () => [
    { id: "P006", name: "Lakshmi Devi", age: 38, phone: "+91 9876543220", status: "Active" },
    { id: "P003", name: "Mohammed Ali Khan", age: 45, phone: "+91 9876543214", status: "Critical" },
    { id: "P002", name: "Priya Devi Gupta", age: 28, phone: "+91 9876543212", status: "Active" },
    { id: "P005", name: "Rajesh Yadav", age: 29, phone: "+91 9876543218", status: "Inactive" },
    { id: "P001", name: "Ravi Kumar Sharma", age: 32, phone: "+91 9876543210", status: "Active" },
    { id: "P004", name: "Sunita Kumari", age: 35, phone: "+91 9876543216", status: "Active" },
  ];

  const getHealthStatus = (migrant) => {
    if (migrant.lastRecordType === 'doctor_visit' && migrant.lastCheckup) {
      const daysSinceLastCheckup = Math.floor((new Date() - new Date(migrant.lastCheckup)) / (1000 * 60 * 60 * 24));
      if (daysSinceLastCheckup < 30) return "Active";
      if (daysSinceLastCheckup < 90) return "Inactive";
      return "Critical";
    }
    if (migrant.totalRecords > 0) return "Active";
    return "Inactive";
  };

  const activeCases = migrantsData.filter((m) => m.status?.toLowerCase() === "active").length;
  const criticalCases = migrantsData.filter((m) => m.status?.toLowerCase() === "critical").length;
  const inactiveCases = migrantsData.filter((m) => m.status?.toLowerCase() === "inactive").length;

  const chartData = [
    { name: "Active", value: activeCases },
    { name: "Critical", value: criticalCases },
    { name: "Inactive", value: inactiveCases },
  ];

  const COLORS = ["#22c55e", "#ef4444", "#9ca3af"];

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectChart = (type) => {
    setSelectedChart(type);
    setDropdownOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    console.log("Language changed to:", e.target.value);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between bg-white shadow px-6 py-3 sticky top-0 z-20">
        <div className="flex items-center space-x-3">
          <div className="bg-black-600 rounded-md flex items-center justify-center">
            <img src={logo} alt="Logo" className="w-12 h-12" />
          </div>
          <div>
            <h1 className="font-bold text-xl">Arogya Sanchay</h1>
            <p className="text-sm text-gray-500">Government Portal</p>
          </div>
        </div>
        
        <nav className="flex items-center space-x-8 text-gray-700 text-sm font-medium">
          <div className="flex items-center gap-1">
            <span>🌐</span>
            <select
              className="border border-gray-300 rounded px-2 py-1 text-sm cursor-pointer hover:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={language}
              onChange={handleLanguageChange}
            >
              <option value="hindi">Hindi</option>
              <option value="english">English</option>
              <option value="malayalam">Malayalam</option>
            </select>
          </div>
          
          <button
            className="hover:text-green-700 font-semibold cursor-pointer"
            onClick={() => {
              setDropdownOpen(false);
              navigate("/migrants");
            }}
          >
            Migrant List
          </button>
          
          <button
            className="hover:text-green-700 font-semibold cursor-pointer"
            onClick={() => navigate("/government-dashboard")}
          >
            Dashboard
          </button>
          
          <div className="relative" ref={dropdownRef}>
            <button
              className="hover:text-green-700 font-semibold cursor-pointer"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              Heatmaps ▼
            </button>
            {dropdownOpen && (
              <div className="absolute mt-2 bg-white border rounded shadow-md w-32 z-50">
                <button
                  onClick={() => handleSelectChart("pie")}
                  className={`block w-full px-4 py-2 text-left hover:bg-green-50 ${selectedChart === "pie" ? "font-bold text-green-700" : ""}`}
                >
                  Pie Chart
                </button>
                <button
                  onClick={() => handleSelectChart("bar")}
                  className={`block w-full px-4 py-2 text-left hover:bg-green-50 ${selectedChart === "bar" ? "font-bold text-green-700" : ""}`}
                >
                  Bar Graph
                </button>
              </div>
            )}
          </div>
        </nav>
        
        <div className="flex items-center space-x-4 bg-green-100 rounded-lg px-3 py-2">
          <img src={image} alt="Government Official" className="w-9 h-9 rounded-full" />
          <div className="text-sm">
            <div className="font-semibold">{user.name || "Government Official"}</div>
            <div className="text-green-700">@{user.email?.split('@')[0] || "user"}</div>
          </div>
          <button 
            className="bg-red-600 hover:bg-red-700 text-white rounded px-3 py-1 text-sm font-semibold"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>
      
      <main className="flex p-10 gap-10 max-w-7xl mx-auto">
        <section className="flex-grow bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold">Health Status Analytics</h1>
            <button
              onClick={fetchMigrantsData}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
            >
              Refresh Data
            </button>
          </div>

          {/* Statistics Summary */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-green-100 p-4 rounded-lg text-center">
              <p className="text-green-700 font-bold text-2xl">{activeCases}</p>
              <p className="text-gray-600 text-sm">Active Cases</p>
            </div>
            <div className="bg-red-100 p-4 rounded-lg text-center">
              <p className="text-red-700 font-bold text-2xl">{criticalCases}</p>
              <p className="text-gray-600 text-sm">Critical Cases</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <p className="text-gray-700 font-bold text-2xl">{inactiveCases}</p>
              <p className="text-gray-600 text-sm">Inactive Cases</p>
            </div>
          </div>

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <p className="mt-4 text-gray-600">Loading health status data...</p>
            </div>
          )}

          {error && !loading && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-700 text-sm">{error} - Showing sample data</p>
            </div>
          )}

          {!loading && selectedChart && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {selectedChart === "pie" && (
                <div className="bg-gray-50 p-6 rounded-xl shadow-md col-span-full lg:col-span-1">
                  <h2 className="text-lg font-bold mb-4">Health Status Distribution (Pie Chart)</h2>
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie 
                        data={chartData} 
                        cx="50%" 
                        cy="50%" 
                        outerRadius={120} 
                        dataKey="value" 
                        label={({name, value, percent}) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
              
              {selectedChart === "bar" && (
                <div className="bg-gray-50 p-6 rounded-xl shadow-md col-span-full lg:col-span-1">
                  <h2 className="text-lg font-bold mb-4">Health Status Distribution (Bar Chart)</h2>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value">
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Additional Analytics Panel */}
              <div className="bg-gray-50 p-6 rounded-xl shadow-md">
                <h2 className="text-lg font-bold mb-4">Health Insights</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white rounded">
                    <span className="text-sm font-medium">Total Migrants</span>
                    <span className="font-bold text-blue-600">{migrantsData.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded">
                    <span className="text-sm font-medium">Health Coverage</span>
                    <span className="font-bold text-green-600">
                      {migrantsData.length > 0 ? Math.round(((activeCases + criticalCases) / migrantsData.length) * 100) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded">
                    <span className="text-sm font-medium">Critical Ratio</span>
                    <span className="font-bold text-red-600">
                      {activeCases + criticalCases > 0 ? Math.round((criticalCases / (activeCases + criticalCases)) * 100) : 0}%
                    </span>
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 rounded">
                    <p className="text-sm text-blue-700">
                      💡 Status is determined by recent health records and checkup frequency
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!loading && !selectedChart && (
            <div className="text-center py-12">
              <p className="text-gray-600">Select a chart type from the Heatmaps dropdown to view health status analytics</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}