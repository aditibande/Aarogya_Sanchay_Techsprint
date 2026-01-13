import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import image from "../assets/Government employee.jpg";
import logo from "../assets/logo.png";
import api from "../api";

export default function GovernmentDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalMigrants: 0,
    activeCases: 0,
    criticalCases: 0,
    totalPatients: 0,
    doctors: 0,
    pendingReports: 0
  });
  const [language, setLanguage] = useState("english");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (["doctor", "admin", "govt"].includes(parsedUser.role)) {
        setUser(parsedUser);
        fetchMigrantStats();
      } else {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchMigrantStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/migrants/stats", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setStats({
          totalMigrants: response.data.stats.totalMigrants,
          activeCases: response.data.stats.activeCases,
          criticalCases: response.data.stats.criticalCases,
          totalPatients: response.data.stats.totalPatients,
          doctors: response.data.stats.doctors,
          pendingReports: response.data.stats.pendingReports
        });
      }
    } catch (error) {
      console.error("Error fetching migrant stats:", error);
      setStats({
        totalMigrants: 0,
        activeCases: 0,
        criticalCases: 0,
        totalPatients: 0,
        doctors: 0,
        pendingReports: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMigrantsList = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/migrants", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        return response.data.data; 
      }
    } catch (error) {
      console.error("Error fetching migrants list:", error);
      return [];
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    console.log("Selected language:", selectedLanguage);
    // You can implement language switching logic here
  };

  const handleMigrantsNavigation = async () => {
    navigate("/migrants");
  };

  const handleRecordsNavigation = () => {
    navigate("/view-records");
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
            onClick={handleMigrantsNavigation}
          >
            Migrant List
          </button>
          
          <button
            className="hover:text-green-700 font-semibold cursor-pointer"
            onClick={() => navigate("/heatmaps")}
          >
            Heatmaps
          </button>
        </nav>
        
        <div className="flex items-center space-x-4 bg-green-100 rounded-lg px-3 py-2">
          <img src={image} alt="Doctor" className="w-9 h-9 rounded-full" />
          <div className="text-sm">
            <div className="font-semibold">{user.name || "Government Official"}</div>
            <div className="text-green-700">@{user.email?.split('@')[0] || user._id || "user"}</div>
          </div>
          <button 
            className="bg-red-600 hover:bg-red-700 text-white rounded px-3 py-1 text-sm font-semibold"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>
      
      <main className="flex p-10 gap-10">
        {/* Sidebar */}
        <aside className="bg-white rounded-xl shadow-md p-6 w-72">
          <div className="flex flex-col items-center space-y-4">
            <img
              src={image}
              alt="Government Official"
              className="w-24 h-24 rounded-full border-4 border-green-200"
            />
            <h2 className="font-bold text-lg">{user.name || "Government Official"}</h2>
            <p className="text-green-700 font-semibold">@{user.email?.split('@')[0] || user._id || "user"}</p>
            <p className="text-gray-600 text-sm capitalize">{user.role || "Healthcare Administration"}</p>
            <p className="text-gray-400 text-xs">ID: {user.healthId || user._id?.slice(-8) || "N/A"}</p>
          </div>
          
          <div className="mt-10 space-y-4">
            <div
              className="flex justify-between items-center bg-blue-100 p-4 rounded-lg cursor-pointer hover:shadow transition-shadow"
              onClick={handleMigrantsNavigation}
            >
              <div>
                <p className="text-blue-700 font-bold text-2xl">
                  {loading ? "..." : stats.totalMigrants}
                </p>
                <p className="text-sm text-gray-600">Total Migrants</p>
              </div>
              <div className="bg-blue-700 text-white rounded p-3">👥</div>
            </div>

            <div
              className="flex justify-between items-center bg-green-100 p-4 rounded-lg cursor-pointer hover:shadow transition-shadow"
              onClick={handleRecordsNavigation}
            >
              <div>
                <p className="text-green-700 font-bold text-2xl">
                  {loading ? "..." : stats.activeCases}
                </p>
                <p className="text-sm text-gray-600">Active Cases</p>
              </div>
              <div className="bg-green-700 text-white rounded p-3">🔍</div>
            </div>

            <div
              className="flex justify-between items-center bg-red-100 p-4 rounded-lg cursor-pointer hover:shadow transition-shadow"
              onClick={handleRecordsNavigation}
            >
              <div>
                <p className="text-red-700 font-bold text-2xl">
                  {loading ? "..." : stats.criticalCases}
                </p>
                <p className="text-sm text-gray-600">Critical Cases</p>
              </div>
              <div className="bg-red-700 text-white rounded p-3">🚨</div>
            </div>
          </div>
        </aside>
        
        <section className="flex-grow bg-white rounded-xl shadow-md p-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-green-100 p-6 rounded-lg text-center">
              <p className="text-green-700 font-bold text-3xl">
                {loading ? "..." : stats.totalPatients.toLocaleString()}
              </p>
              <p className="text-gray-600 text-sm">Total Patients</p>
            </div>
            <div className="bg-blue-100 p-6 rounded-lg text-center">
              <p className="text-blue-700 font-bold text-3xl">
                {loading ? "..." : stats.doctors}
              </p>
              <p className="text-gray-600 text-sm">Doctors</p>
            </div>
            <div className="bg-yellow-100 p-6 rounded-lg text-center">
              <p className="text-yellow-700 font-bold text-3xl">
                {loading ? "..." : stats.pendingReports}
              </p>
              <p className="text-gray-600 text-sm">Pending Reports</p>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-4">System Status</h2>
            <ul className="space-y-3 text-sm">
              <li className={`border-l-4 p-3 rounded ${stats.totalMigrants > 0 ? 'bg-green-50 border-green-600' : 'bg-gray-50 border-gray-400'}`}>
                {stats.totalMigrants > 0 ? '✅' : '⏳'} {stats.totalMigrants > 0 ? `${stats.totalMigrants} migrants registered in system` : 'Loading migrant data...'}
              </li>
              <li className={`border-l-4 p-3 rounded ${stats.activeCases > 0 ? 'bg-yellow-50 border-yellow-600' : 'bg-gray-50 border-gray-400'}`}>
                {stats.activeCases > 0 ? '⚠️' : '📊'} {stats.activeCases > 0 ? `${stats.activeCases} active cases requiring attention` : 'No active cases at the moment'}
              </li>
              <li className={`border-l-4 p-3 rounded ${stats.doctors > 0 ? 'bg-blue-50 border-blue-600' : 'bg-gray-50 border-gray-400'}`}>
                {stats.doctors > 0 ? '👨‍⚕️' : '📋'} {stats.doctors > 0 ? `${stats.doctors} healthcare professionals in network` : 'Loading healthcare network data...'}
              </li>
            </ul>
            
            {loading && (
              <div className="mt-4 text-center">
                <p className="text-gray-500 text-sm">Loading real-time statistics...</p>
              </div>
            )}
            
            {!loading && stats.totalMigrants === 0 && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-yellow-700 text-sm">
                  No data available. Please check your API connection or ensure migrants are registered in the system.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}



