import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import api from "../api";

export default function PhoneLogin() {
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const setupRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
                size: "invisible",
                callback: (response) => {
                    console.log("reCAPTCHA solved:", response);
                },
            });
        }
    };

    const sendOtp = async () => {
        if (!phone || !phone.startsWith("+")) {
            alert("Enter phone number in format +<countrycode><number>");
            return;
        }

        setupRecaptcha();
        setLoading(true);

        try {
            const result = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
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
            const userCredential = await confirmationResult.confirm(otp);
            const idToken = await userCredential.user.getIdToken();

            const res=await api.post("/auth/phone-login", { idToken });


            if (res.data.token && res.data.user) {
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("user", JSON.stringify(res.data.user));

                alert("Login successful!");
                navigate("/dashboard");
            } else {
                alert("Failed to get user or token from backend");
            }
        } catch (err) {
            console.error("Error verifying OTP:", err);
            alert("Invalid OTP or backend error: " + err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
                    Phone Login
                </h2>

                {/* Phone input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91XXXXXXXXXX"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-200 focus:border-green-500 outline-none"
                    />
                </div>

                <button
                    onClick={sendOtp}
                    disabled={loading}
                    className="w-full py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
                >
                    {loading ? "Sending OTP..." : "Send OTP"}
                </button>

                <div id="recaptcha-container"></div>

                {/* OTP input */}
                {confirmationResult && (
                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Enter OTP
                        </label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter OTP"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-200 focus:border-green-500 outline-none"
                        />

                        <button
                            onClick={verifyOtp}
                            disabled={loading}
                            className="w-full mt-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
                        >
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
