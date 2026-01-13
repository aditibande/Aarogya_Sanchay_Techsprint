import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HealthIdPage() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center">
        {step === 0 && (
          <>
            <h1 className="text-xl font-bold mb-4">Digital Health ID</h1>
            <button
              onClick={() => setStep(1)}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Generate Health ID
            </button>
          </>
        )}

        {step === 1 && (
          <>
            <h2 className="text-lg font-semibold mb-4">Fill this form</h2>
            <button
              onClick={() => navigate("/health-id/form")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Proceed to Form
            </button>
          </>
        )}
      </div>
    </div>
  );
}
