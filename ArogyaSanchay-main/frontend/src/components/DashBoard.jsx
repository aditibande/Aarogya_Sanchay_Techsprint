import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import logo from "../assets/logo.png";

export default function DashBoard() {
  const [user, setUser] = useState(null);
  const [records, setRecords] = useState([]);
  const [showNotebookDropdown, setShowNotebookDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [language, setLanguage] = useState("English");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      if (parsedUser.id) {
        fetchRecords(parsedUser.id);
      } else {
        console.warn("User object missing id:", parsedUser);
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchRecords = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get(`/health-records/getRecords/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched records:", res.data);
      setRecords(res.data || []);
    } catch (err) {
      console.error("Error fetching records:", err.response?.data || err.message);
      setRecords([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setShowLanguageDropdown(false);
  };

  if (!user) return null;

  const lastCheckup = records.length
    ? new Date(records[0].date).toLocaleDateString()
    : "N/A";

  const vaccinationUpToDate = records.some((r) =>
    r.type.toLowerCase().includes("vaccination")
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-white shadow-sm px-6 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="bg-black-600 rounded-md flex items-center justify-center">
            <img src={logo} alt="Logo" className="w-12 h-12" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Arogya Sanchay</h1>
            <p className="text-xs text-gray-500">Kerala Migrant Workers</p>
          </div>
        </div>
        
        <nav className="flex space-x-6 text-sm font-medium items-center relative">
          <a href="#" className="hover:text-green-600">
            Updates
          </a>
          <div
            className="cursor-pointer flex items-center space-x-1 hover:text-green-600 relative"
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
          >
            <span>🌐 {language}</span>
          </div>
          {showLanguageDropdown && (
            <div className="absolute top-10 right-0 bg-white border rounded-lg shadow w-32">
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => handleLanguageChange("English")}
              >
                English
              </button>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => handleLanguageChange("Hindi")}
              >
                हिंदी
              </button>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => handleLanguageChange("Malayalam")}
              >
                മലയാളം
              </button>
            </div>
          )}
          <button
            onClick={() => navigate("/notifications")}
            className="hover:text-green-600 flex items-center gap-1"
          >
            🔔 Notifications
          </button>
        </nav>

        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium">Welcome, {user.name}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-1 border rounded-lg hover:bg-green-50"
          >
            Logout
          </button>
        </div>
      </header>
      
      <div className="flex p-6 gap-6">
        <aside className="w-64 space-y-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-bold">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.role}</p>
            <p className="text-xs text-gray-400">ID: {user.healthId || user.id || "N/A"}</p>
          </div>
          
          <div
            className="bg-green-50 p-4 rounded-lg shadow cursor-pointer"
            onClick={() => navigate("/health-id")}
          >
            <h3 className="font-semibold text-green-700">Health ID Card</h3>
            <p className="text-sm text-gray-600">
              View or Generate your digital health ID
            </p>
          </div>
          
          <div
            className="bg-blue-50 p-4 rounded-lg shadow cursor-pointer relative"
            onClick={() => setShowNotebookDropdown(!showNotebookDropdown)}
          >
            <h3 className="font-semibold text-blue-700">Digital Notebook</h3>
            <p className="text-sm text-gray-600">Manage health records</p>
            {showNotebookDropdown && (
              <div className="absolute top-full left-0 mt-2 w-full bg-white border rounded-lg shadow z-50">
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-50"
                  onClick={() => navigate("/add-record")}
                >
                  ➕ Add Health Record
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-50"
                  onClick={() => navigate("/view-records")}
                >
                  📂 View Existing Records
                </button>
              </div>
            )}
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold">Quick Stats</h3>
            <p className="text-sm">
              Total Records: <span className="font-semibold">{records.length}</span>
            </p>
            <p className="text-sm">
              Last Checkup: <span className="font-semibold">{lastCheckup}</span>
            </p>
            <p className="text-sm">
              Vaccinations:{" "}
              <span className="text-green-600 font-semibold">
                {vaccinationUpToDate ? "Up to date" : "Pending"}
              </span>
            </p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg shadow">
            <h3 className="font-semibold text-green-700 mb-2">💬 Chatbot</h3>
            <p className="text-sm text-gray-600 mb-3">
              Need quick help? Chat with our AI-powered assistant.
            </p>
            <button
              onClick={() => {
                sessionStorage.setItem('previousPage', window.location.href);
                window.open("https://aarogya-sanchay.vercel.app/", "_blank");
              }}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Open Chatbot
            </button>
          </div>
        </aside>
        
        <main className="flex-1 bg-white rounded-xl shadow p-10 overflow-y-auto">
          <h1 className="text-3xl font-bold text-green-700 mb-6">
            What is Arogya Sanchay?
          </h1>
          <p className="text-gray-700 leading-relaxed mb-6 text-justify">
            <span className="font-semibold">Arogya Sanchay</span> is a{" "}
            <span className="font-semibold">
              Comprehensive Health Record System (CHRS)
            </span>{" "}
            that collects, stores, and manages all aspects of a patient's health
            information in a centralized, accessible, and secure way. It acts as
            a one-platform solution to track individuals who may act as carriers
            of infectious diseases, posing serious public health risks.
          </p>
          <p className="text-gray-700 leading-relaxed mb-8 text-justify">
            This dedicated system enhances{" "}
            <span className="font-semibold">
              disease prevention, surveillance, and equitable healthcare access
            </span>
            , while reducing duplication of medical tests and ensuring faster,
            fair treatment for all.
          </p>
          <h2 className="text-2xl font-semibold text-green-600 mb-4">
            ✨ Key Features
          </h2>
          <div className="grid grid-cols-2 gap-6 mb-10">
            <div className="bg-green-50 p-4 rounded-lg shadow-sm">
              <p className="font-medium">📖 Medical History</p>
              <p className="text-sm text-gray-600">
                Tracks past illnesses, surgeries, allergies, and family history.
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg shadow-sm">
              <p className="font-medium">🆔 Health ID / QR</p>
              <p className="text-sm text-gray-600">
                Unique digital ID to link patients across facilities.
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg shadow-sm">
              <p className="font-medium">📒 Digital Health Notebook</p>
              <p className="text-sm text-gray-600">
                Stores reports, prescriptions, and medical history.
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg shadow-sm">
              <p className="font-medium">🌐 Multilingual Support</p>
              <p className="text-sm text-gray-600">
                Available in English, Hindi, and Malayalam.
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg shadow-sm col-span-2">
              <p className="font-medium">🔒 Privacy & Consent</p>
              <p className="text-sm text-gray-600">
                Secure records accessible only with patient consent.
              </p>
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-green-600 mb-4">
            👥 Beneficiaries
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4 text-justify">
            <span className="font-semibold">Migrant Workers</span> benefit the
            most from Arogya Sanchay. They can carry a digital health ID card
            along with complete medical history, accessible anytime by
            authorized healthcare providers.
          </p>
          <p className="text-gray-700 leading-relaxed text-justify">
            This ensures <span className="font-semibold">instant access</span>{" "}
            to critical health data, improves emergency response, avoids test
            duplication, and saves both{" "}
            <span className="font-semibold"> time and money</span> — ultimately
            ensuring fair healthcare access.
          </p>
        </main>
      </div>
    </div>
  );
}