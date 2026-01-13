import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HealthIDForm() {
  const [familyCount, setFamilyCount] = useState(0);
  const [familyMembers, setFamilyMembers] = useState([]);
  const navigate = useNavigate();

  const handleFamilyCountChange = (e) => {
    const count = parseInt(e.target.value) || 0;
    setFamilyCount(count);
    const updated = Array.from({ length: count }, () => ({
      name: "",
      age: "",
      relation: "",
      gender: "",
      bloodGroup: "",
      aadhar: "",
      phone: "",
    }));
    setFamilyMembers(updated);
  };

  const handleFamilyChange = (index, field, value) => {
    const updated = [...familyMembers];
    updated[index][field] = value;
    setFamilyMembers(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const data = {
      fullName: formData.get("fullName"),
      gender: formData.get("gender"),
      dob: formData.get("dob"),
      aadhar: formData.get("aadhar"),
      phone: formData.get("phone"),
      photo: formData.get("photo"),
      address: formData.get("address"),
      occupation: formData.get("occupation"),
      bloodGroup: formData.get("bloodGroup"),
      familyCount: familyCount,
      familyMembers: familyMembers,
      language: formData.get("language"),
    };

    navigate("/health-id/card", { state: { userData: data } });
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-2xl rounded-2xl border-t-4 border-green-600">
      <h2 className="text-3xl font-bold mb-6 text-center text-green-700">
        Migrant Worker Health ID Registration
      </h2>
      <p className="text-center text-gray-600 mb-8">
        Please fill out the form carefully. All fields are mandatory unless specified.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="p-6 border rounded-xl bg-green-50">
          <h3 className="text-lg font-semibold mb-4 text-green-700">
            Personal Information
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="fullName"
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select
                name="gender"
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400 outline-none"
              >
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input
                type="date"
                name="dob"
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Aadhar Number</label>
              <input
                type="number"
                name="aadhar"
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                name="phone"
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Upload Photo</label>
              <input
                type="file"
                name="photo"
                accept="image/*"
                required
                className="w-full text-sm"
              />
            </div>
          </div>
        </div>

        {/* Address & Occupation */}
        <div className="p-6 border rounded-xl bg-green-50">
          <h3 className="text-lg font-semibold mb-4 text-green-700">Work & Address</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Current Address in Kerala
              </label>
              <textarea
                name="address"
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Occupation / Work Type</label>
              <select
                name="occupation"
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400 outline-none"
              >
                <option value="">Select</option>
                <option>Construction</option>
                <option>Fishing</option>
                <option>Domestic</option>
                <option>Factory</option>
                <option>Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Health Details */}
        <div className="p-6 border rounded-xl bg-green-50">
          <h3 className="text-lg font-semibold mb-4 text-green-700">Health Details</h3>
          <label className="block text-sm font-medium text-gray-700">Blood Group</label>
          <select
            name="bloodGroup"
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400 outline-none"
          >
            <option value="">Select</option>
            <option>A+</option>
            <option>A-</option>
            <option>B+</option>
            <option>B-</option>
            <option>AB+</option>
            <option>AB-</option>
            <option>O+</option>
            <option>O-</option>
          </select>
        </div>

        {/* Family Members */}
        <div className="p-6 border rounded-xl bg-green-50">
          <h3 className="text-lg font-semibold mb-4 text-green-700">Family Details</h3>
          <label className="block text-sm font-medium text-gray-700">
            Number of Family Members
          </label>
          <input
            type="number"
            name="familyCount"
            min="0"
            max="4"
            value={familyCount}
            onChange={handleFamilyCountChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400 outline-none"
          />

          {Array.from({ length: familyCount }).map((_, index) => (
            <div
              key={index}
              className="p-4 mt-4 border rounded-lg bg-white shadow-sm"
            >
              <h4 className="font-semibold mb-2 text-green-600">
                Family Member {index + 1}
              </h4>
              <div className="grid md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Name"
                  value={familyMembers[index]?.name || ""}
                  onChange={(e) => handleFamilyChange(index, "name", e.target.value)}
                  className="p-2 border rounded focus:ring-2 focus:ring-green-400 outline-none"
                />
                <input
                  type="number"
                  placeholder="Age"
                  value={familyMembers[index]?.age || ""}
                  onChange={(e) => handleFamilyChange(index, "age", e.target.value)}
                  className="p-2 border rounded focus:ring-2 focus:ring-green-400 outline-none"
                />
                <select
                  value={familyMembers[index]?.relation || ""}
                  onChange={(e) => handleFamilyChange(index, "relation", e.target.value)}
                  className="p-2 border rounded focus:ring-2 focus:ring-green-400 outline-none"
                >
                  <option value="">Relation</option>
                  <option>Spouse</option>
                  <option>Child</option>
                  <option>Parent</option>
                  <option>Other</option>
                </select>
                <select
                  value={familyMembers[index]?.gender || ""}
                  onChange={(e) => handleFamilyChange(index, "gender", e.target.value)}
                  className="p-2 border rounded focus:ring-2 focus:ring-green-400 outline-none"
                >
                  <option value="">Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
                <select
                  value={familyMembers[index]?.bloodGroup || ""}
                  onChange={(e) => handleFamilyChange(index, "bloodGroup", e.target.value)}
                  className="p-2 border rounded focus:ring-2 focus:ring-green-400 outline-none"
                >
                  <option value="">Blood Group</option>
                  <option>A+</option>
                  <option>A-</option>
                  <option>B+</option>
                  <option>B-</option>
                  <option>AB+</option>
                  <option>AB-</option>
                  <option>O+</option>
                  <option>O-</option>
                </select>
                <input
                  type="number"
                  placeholder="Aadhar Number"
                  value={familyMembers[index]?.aadhar || ""}
                  onChange={(e) => handleFamilyChange(index, "aadhar", e.target.value)}
                  className="p-2 border rounded focus:ring-2 focus:ring-green-400 outline-none"
                />
                <input
                  type="tel"
                  placeholder="Phone Number (Optional)"
                  value={familyMembers[index]?.phone || ""}
                  onChange={(e) => handleFamilyChange(index, "phone", e.target.value)}
                  className="p-2 border rounded focus:ring-2 focus:ring-green-400 outline-none"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Language */}
        <div className="p-6 border rounded-xl bg-green-50">
          <h3 className="text-lg font-semibold mb-4 text-green-700">Preferences</h3>
          <label className="block text-sm font-medium text-gray-700">Preferred Language</label>
          <select
            name="language"
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400 outline-none"
          >
            <option value="">Select</option>
            <option>Malayalam</option>
            <option>Hindi</option>
            <option>English</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold text-lg shadow hover:bg-green-700 transition"
        >
          Submit & Generate ID
        </button>
      </form>
    </div>
  );
}
