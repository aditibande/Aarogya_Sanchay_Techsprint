import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Slider from "./Slider";
import { auth } from "../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

export default function LoginPage() {
  const [tab, setTab] = useState("login");
  const [usePhoneLogin, setUsePhoneLogin] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "migrant", 
  });
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  
useEffect(() => {
  const handleBackButton = (event) => {
    event.preventDefault();
    navigate("/");
  };

  window.addEventListener("popstate", handleBackButton);

  return () => {
    window.removeEventListener("popstate", handleBackButton);
  };
}, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (tab === "login") {
        const payload = {
          email: formData.email || undefined,
          phone: formData.phone || undefined,
          password: formData.password,
        };

        const res = await api.post("/auth/login", payload);

        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }

        const role = res.data.user.role.toLowerCase();
        if (role === "migrant") navigate("/dashboard");
        else if (role === "govt") navigate("/government-dashboard");
        else navigate("/dashboard");
      } else {
        if (formData.password !== formData.confirmPassword) {
          return alert("Passwords do not match!");
        }

        const payload = {
          name: formData.name,
          email: formData.email || undefined,
          phone: formData.phone || undefined,
          password: formData.password,
          role: formData.role.toLowerCase(), 
        };

        const res = await api.post("/auth/signup", payload);

        if (res.data.healthId) {
          alert(`User registered! Health ID: ${res.data.healthId}`);
        }

        const role = payload.role;
        if (role === "migrant") navigate("/dashboard");
        else if (role === "govt") navigate("/government-dashboard");
        else navigate("/dashboard");
      }
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Something went wrong!");
    }
  };

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        { size: "invisible", callback: () => console.log("reCAPTCHA verified") }
      );
    }
  };

  const sendOtp = async () => {
    if (!formData.phone.startsWith("+")) {
      alert("Phone number must be in format +<countrycode><number>");
      return;
    }
    setupRecaptcha();
    try {
      setLoading(true);
      const result = await signInWithPhoneNumber(auth, formData.phone, window.recaptchaVerifier);
      setConfirmationResult(result);
      alert("OTP sent!");
    } catch (err) {
      console.error("Error sending OTP:", err);
      alert("Error sending OTP: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!confirmationResult) {
      alert("Please request OTP first");
      return;
    }
    try {
      setLoading(true);
      const userCredential = await confirmationResult.confirm(otp);
      const idToken = await userCredential.user.getIdToken();

      const res = await api.post("/auth/phone-login", { idToken });

      if (res.data.token && res.data.user) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        alert("Login successful!");
        const role = res.data.user.role.toLowerCase();
        if (role === "migrant") navigate("/dashboard");
        else if (role === "govt") navigate("/government-dashboard");
        else navigate("/dashboard");
      } else {
        alert("Failed to get user or token from backend");
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      alert("Invalid OTP or backend error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 flex flex-col justify-center px-8">
        <Slider />
      </div>

      <div className="w-1/2 flex items-center justify-center px-12">
        <div className="w-full max-w-md">
          {!usePhoneLogin ? (
            <>
              {/* Tabs */}
              <div className="flex mb-6 bg-gray-100 rounded-full p-1">
                <button
                  onClick={() => setTab("login")}
                  className={`flex-1 py-2 rounded-full ${
                    tab === "login" ? "bg-white shadow text-green-700 font-semibold" : "text-gray-600"
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setTab("signup")}
                  className={`flex-1 py-2 rounded-full ${
                    tab === "signup" ? "bg-white shadow text-green-700 font-semibold" : "text-gray-600"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              <h2 className="text-2xl font-bold mb-2">{tab === "login" ? "Welcome Back" : "Create Account"}</h2>
              <p className="text-gray-500 mb-6">
                {tab === "login" ? "Sign in to access your dashboard" : "Sign up to create your account"}
              </p>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {tab === "signup" && (
                  <>
                    <div>
                      <label className="text-sm font-medium">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-green-200"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                        className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-green-200"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="text-sm font-medium">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-green-200"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-green-200"
                    required
                  />
                </div>

                {tab === "signup" && (
                  <div>
                    <label className="text-sm font-medium">Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter your password"
                      className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-green-200"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-green-200"
                  >
                    <option value="migrant">Migrant Worker</option>
                    <option value="govt">Government Official</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 flex items-center justify-center space-x-2"
                >
                  <span>{tab === "login" ? "Sign In" : "Sign Up"}</span>
                </button>
              </form>

              {tab === "login" && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setUsePhoneLogin(true)}
                    className="text-green-600 font-medium hover:underline"
                  >
                    Login with Phone Number
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Phone login */}
              <h2 className="text-2xl font-bold mb-2">Login with Phone</h2>
              <p className="text-gray-500 mb-6">Enter your phone number to receive an OTP.</p>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91XXXXXXXXXX"
                    className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-green-200"
                  />
                </div>

                <button
                  onClick={sendOtp}
                  disabled={loading}
                  className="w-full py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>

                <div id="recaptcha-container"></div>

                <div>
                  <label className="text-sm font-medium">Enter OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-green-200"
                  />
                </div>

                <button
                  onClick={verifyOtp}
                  disabled={loading}
                  className="w-full py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>

                <div className="mt-4 text-center">
                  <button
                    onClick={() => setUsePhoneLogin(false)}
                    className="text-green-600 font-medium hover:underline"
                  >
                    ← Back to Email/Password Login
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
