import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";
import Resources from "./pages/Resources";

export default function LandingPage() {
  const [language, setLanguage] = useState("english");

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    console.log("Language changed to:", e.target.value);
    
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="flex justify-between items-center px-8 py-4 shadow-sm bg-white">
        <div className="flex items-center space-x-2">
          <div className="bg-black-600 rounded-md flex items-center justify-center">
            <img src={logo} alt="Logo" className="w-12 h-12" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Arogya Sanchay</h1>
            <p className="text-xs text-gray-500">Government of Kerala</p>
          </div>
        </div>
        
        <nav className="flex items-center space-x-6">
          <a href="#about" className="text-gray-600 hover:text-black transition-colors">
            About
          </a>
          <a href="#features" className="text-gray-600 hover:text-black transition-colors">
            Features
          </a>
           <a href="/resources" className="text-gray-600 hover:text-black transition-colors">
            Resources
          </a>
          <div className="flex items-center gap-1">
            <span>🌐</span>
            <select 
              className="border border-gray-300 rounded px-2 py-1 text-sm cursor-pointer hover:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={language}
              onChange={handleLanguageChange}
            >
              <option value="english">English</option>
              <option value="malayalam">Malayalam</option>
              <option value="hindi">Hindi</option>
            </select>
          </div>
          <Link 
            to="/login" 
            className="text-gray-600 hover:text-black transition-colors font-medium"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 rounded-md bg-green-700 text-white hover:bg-green-800 transition-colors font-medium"
          >
            Sign Up
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-green-800 text-white text-center py-20 px-6">
        <div className="bg-green-100 p-4 rounded-full mb-6 mx-auto w-20 h-20 flex items-center justify-center">
          <span className="text-green-700 text-4xl font-bold">+</span>
        </div>
        <h1 className="text-4xl font-bold mb-6">Welcome to Arogya Sanchay</h1>
        <p className="text-lg max-w-2xl mx-auto mb-8">
          A secure digital healthcare management system by the Government of Kerala 
          designed specifically for migrant workers. Your health records, protected and accessible.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/signup"
            className="px-8 py-3 rounded-lg bg-white text-green-800 hover:bg-gray-100 font-medium transition-colors shadow-lg"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="px-8 py-3 rounded-lg border-2 border-white text-white hover:bg-white hover:text-green-800 font-medium transition-colors"
          >
            Login to Dashboard
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Our Core Features</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          Built to provide comprehensive, secure, and efficient healthcare
          support for our migrant worker community in Kerala.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="p-6 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="text-green-700 mb-4 text-4xl">🛡️</div>
            <h3 className="font-semibold text-lg mb-2">
              Secure Digital Health Records
            </h3>
            <p className="text-gray-600 text-sm">
              Your health information is confidential, encrypted, and protected
              under stringent government security protocols.
            </p>
          </div>

          <div className="p-6 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="text-green-700 mb-4 text-4xl">📂</div>
            <h3 className="font-semibold text-lg mb-2">Unified Health Access</h3>
            <p className="text-gray-600 text-sm">
              Easily access your medical history and share it with authorized
              healthcare providers across the state of Kerala.
            </p>
          </div>

          <div className="p-6 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="text-green-700 mb-4 text-4xl">🌐</div>
            <h3 className="font-semibold text-lg mb-2">
              State-wide Provider Network
            </h3>
            <p className="text-gray-600 text-sm">
              Connect with an extensive network of approved hospitals, clinics,
              and medical professionals dedicated to your care.
            </p>
          </div>
        </div>
      </section>

      {/* Additional Benefits Section */}
      <section id="about" className="py-16 px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Arogya Sanchay?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-700 text-xl">📱</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Digital Health ID</h3>
                <p className="text-gray-600">Generate and carry your digital health ID for quick access to medical services anywhere in Kerala.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-700 text-xl">🏥</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Hospital Network</h3>
                <p className="text-gray-600">Access a wide network of government and private healthcare facilities across Kerala.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-700 text-xl">🔒</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Privacy Protected</h3>
                <p className="text-gray-600">Your health data is encrypted and accessible only to authorized healthcare providers.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-700 text-xl">💬</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Multilingual Support</h3>
                <p className="text-gray-600">Available in English, Hindi, and Malayalam for your convenience.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-green-800 text-white text-center py-16 px-6">
        <h2 className="text-3xl font-bold mb-4">
          Register for Arogya Sanchay Today
        </h2>
        <p className="text-lg max-w-2xl mx-auto mb-8">
          Join the Arogya Sanchay platform to manage your health records and
          access government healthcare services efficiently and securely.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/signup"
            className="bg-white text-green-800 px-8 py-3 rounded-lg shadow hover:bg-gray-100 font-medium transition-colors"
          >
            Create Your Account
          </Link>
          <Link
            to="/health-id"
            className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-green-800 font-medium transition-colors"
          >
            Generate Health ID
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 px-8 text-center text-sm text-gray-600 mt-auto">
        <div className="flex flex-wrap justify-center space-x-6 mb-3">
          <a href="#" className="hover:underline transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:underline transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:underline transition-colors">
            Accessibility
          </a>
          <a href="#" className="hover:underline transition-colors">
            Contact Us
          </a>
          <a href="#" className="hover:underline transition-colors">
            Help & Support
          </a>
        </div>
        <p>
          © 2024 Department of Health, Government of Kerala. All Rights Reserved.
        </p>
        <p className="mt-1 text-xs">
          Healthcare Management System for Migrant Workers
        </p>
      </footer>
    </div>
  );
}