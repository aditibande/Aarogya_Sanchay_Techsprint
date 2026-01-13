import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { QRCodeCanvas } from "qrcode.react";
import photo from "../assets/photo.jpg";
export default function HealthIDCard() {
  const cardRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();
  const { userData } = location.state || {};

  if (!userData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-lg mb-4">
          No health ID data found. Please fill the form first.
        </p>
        <button
          onClick={() => navigate("/health-id/form")}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go to Health ID Form
        </button>
      </div>
    );
  }

  const downloadAsPDF = async () => {
    const element = cardRef.current;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${userData.fullName}_HealthID.pdf`);
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <div
        ref={cardRef}
        className="relative w-[28rem] bg-white shadow-lg rounded-lg border border-gray-300 p-6"
      >
        <div className="flex items-center justify-between border-b-2 border-green-600 pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <div className="bg-green-600 px-3 py-1 rounded-md text-white font-bold">
              Arogya Sanchay
            </div>
          </div>
          <h2 className="text-green-700 text-xl font-semibold">Health ID Card</h2>
        </div>
        <div className="flex items-center space-x-6">
          <img
            src={photo}
            alt="profile"
            className="w-24 h-24 object-cover border border-gray-400"
          />
          <div>
            <p className="text-lg font-semibold">{userData.fullName}</p>
            <p className="text-sm">Health ID : {userData.aadhar}</p>
          </div>
        </div>
        <div className="mt-6 space-y-2 text-gray-700">
          <p>
            <span className="font-semibold">Age:</span> {userData.age || "34"}
          </p>
          <p>
            <span className="font-semibold">Gender:</span> {userData.gender}
          </p>
          <p>
            <span className="font-semibold">Blood Group:</span>{" "}
            {userData.bloodGroup || "O+"}
          </p>
          <p>
            <span className="font-semibold">Contact:</span> {userData.phone}
          </p>
        </div>
        <div className="absolute bottom-6 right-6">
          <QRCodeCanvas value={userData.aadhar} size={70} />
        </div>
      </div>
      <div className="mt-8">
        <button
          onClick={downloadAsPDF}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 text-lg font-medium"
        >
          Download as PDF
        </button>
      </div>
    </div>
  );
}

