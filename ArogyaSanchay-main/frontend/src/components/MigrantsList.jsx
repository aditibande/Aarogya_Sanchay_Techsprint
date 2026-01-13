import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import api from "../api";

export default function MigrantsList() {
  const navigate = useNavigate();
  const [migrants, setMigrants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMigrants, setFilteredMigrants] = useState([]);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (["doctor", "admin", "govt"].includes(parsedUser.role)) {
        setUser(parsedUser);
        fetchMigrants();
      } else {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredMigrants(migrants);
    } else {
      const filtered = migrants.filter(migrant =>
        migrant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        migrant.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        migrant.phone?.includes(searchTerm) ||
        migrant.healthId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMigrants(filtered);
    }
  }, [searchTerm, migrants]);

  const fetchMigrants = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const response = await api.get("/migrants", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setMigrants(response.data.data);
        setFilteredMigrants(response.data.data);
      } else {
        setError("Failed to fetch migrants data");
      }
    } catch (error) {
      console.error("Error fetching migrants:", error);
      setError(error.response?.data?.message || "Failed to load migrants");
      setMigrants([]);
      setFilteredMigrants([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const viewMigrantDetails = (migrantId) => {
    navigate(`/migrant-details/${migrantId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between bg-white shadow px-6 py-3 sticky top-0 z-20">
        <div className="flex items-center space-x-3">
          <div className="bg-black-600 rounded-md flex items-center justify-center">
            <img src={logo} alt="Logo" className="w-12 h-12" />
          </div>
          <div>
            <h1 className="font-bold text-xl">Arogya Sanchay</h1>
            <p className="text-sm text-gray-500">Migrants List</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/government-dashboard")}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Back to Dashboard
          </button>
          <div className="flex items-center space-x-4 bg-green-100 rounded-lg px-3 py-2">
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
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="bg-white rounded-xl shadow p-6">
          {/* Search and Stats Bar */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Registered Migrants</h2>
              <p className="text-gray-600">
                {loading ? "Loading..." : `${filteredMigrants.length} of ${migrants.length} migrants`}
              </p>
            </div>
            
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Search by name, email, phone, or Health ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 w-80"
              />
              <button
                onClick={fetchMigrants}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <p className="mt-4 text-gray-600">Loading migrants data...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-red-600 font-medium">Error: {error}</p>
                <button
                  onClick={fetchMigrants}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredMigrants.length === 0 && migrants.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-gray-50 rounded-lg p-8">
                <p className="text-gray-600 text-lg">No migrants registered in the system yet.</p>
                <p className="text-gray-500 mt-2">Migrants will appear here once they register.</p>
              </div>
            </div>
          )}

          {/* No Search Results */}
          {!loading && !error && filteredMigrants.length === 0 && migrants.length > 0 && searchTerm && (
            <div className="text-center py-12">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <p className="text-yellow-700">No migrants found matching "{searchTerm}"</p>
                <button
                  onClick={() => setSearchTerm("")}
                  className="mt-2 text-yellow-600 hover:text-yellow-800 underline"
                >
                  Clear search
                </button>
              </div>
            </div>
          )}

          {/* Migrants Table */}
          {!loading && !error && filteredMigrants.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Health ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Records
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Checkup
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMigrants.map((migrant) => (
                    <tr key={migrant._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {migrant.name || "No Name"}
                          </div>
                          <div className="text-sm text-gray-500 capitalize">
                            {migrant.role}
                          </div>
                          <div className="text-xs text-gray-400">
                            Registered: {formatDate(migrant.createdAt)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{migrant.email || "N/A"}</div>
                        <div className="text-sm text-gray-500">{migrant.phone || "N/A"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono text-gray-900">
                          {migrant.healthId || "Not Generated"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {migrant.totalRecords || 0} records
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          {migrant.lastCheckup ? formatDate(migrant.lastCheckup) : "Never"}
                        </div>
                        {migrant.lastRecordType && (
                          <div className="text-xs text-gray-400 capitalize">
                            {migrant.lastRecordType.replace('_', ' ')}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => viewMigrantDetails(migrant._id)}
                          className="text-green-600 hover:text-green-900 font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}