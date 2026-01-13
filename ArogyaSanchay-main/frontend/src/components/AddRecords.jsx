// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../api";

// export default function AddRecord() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     title: "",
//     type: "",
//     date: "",
//     description: "",
//   });
//   const [file, setFile] = useState(null);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.title || !formData.type || !formData.date) {
//       alert("Please fill in all required fields: Title, Type, and Date.");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       const data = new FormData();
//       data.append("title", formData.title);
//       data.append("type", formData.type);
//       data.append("date", formData.date);
//       data.append("description", formData.description);
//       if (file) data.append("file", file);

//       const res = await api.post("/health-records/createRecord", data, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       alert("Record created successfully!");
//       navigate("/view-records");

//     } catch (err) {
//       console.error("Create record failed:", err.response?.data || err.message);
//       alert(err.response?.data?.message || "Create record failed.");
//     }
//   };

//   return (
//     <div className="min-h-screen flex justify-center items-center bg-gray-50">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-6 rounded-xl shadow-md w-96 space-y-4"
//       >
//         <h2 className="text-2xl font-bold mb-4 text-center">Add Health Record</h2>

//         <div>
//           <label className="block text-sm font-medium mb-1">Title *</label>
//           <input
//             type="text"
//             name="title"
//             value={formData.title}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border rounded"
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">Type *</label>
//           <select
//             name="type"
//             value={formData.type}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border rounded"
//             required
//           >
//             <option value="">Select Type</option>
//             <option value="Lab-report">Lab-report</option>
//             <option value="prescription">Prescription</option>
//             <option value="vaccination">Vaccination</option>
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">Date *</label>
//           <input
//             type="date"
//             name="date"
//             value={formData.date}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border rounded"
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">Description</label>
//           <textarea
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border rounded"
//             rows={3}
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">Upload File (optional)</label>
//           <input
//             type="file"
//             accept=".pdf,.png,.jpg,.jpeg"
//             onChange={handleFileChange}
//             className="w-full"
//           />
//         </div>

//         <button
//           type="submit"
//           className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
//         >
//           Create Record
//         </button>
//       </form>
//     </div>
//   );
// }












import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function AddRecord() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    date: "",
    description: "",
  });
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.type || !formData.date) {
      alert("Please fill in all required fields: Title, Type, and Date.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const data = new FormData();
      data.append("title", formData.title);
      data.append("type", formData.type);
      data.append("date", formData.date);
      data.append("description", formData.description);
      if (file) data.append("file", file);

      await api.post("/health-records/createRecord", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("✅ Record created successfully!");
      navigate("/view-records");
    } catch (err) {
      console.error("Create record failed:", err.response?.data || err.message);
      alert(err.response?.data?.message || "❌ Create record failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-8">
          Add Health Record
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="Enter record title"
              required
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type <span className="text-red-500">*</span>
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              required
            >
              <option value="">Select Type</option>
              <option value="Lab-report">Lab Report</option>
              <option value="Prescription">Prescription</option>
              <option value="Vaccination">Vaccination</option>
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              rows={4}
              placeholder="Write details about the record..."
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload File (optional)
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-green-50 border-gray-300 hover:border-green-400 transition">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-500">
                  <svg
                    className="w-10 h-10 mb-3 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M7 16V4m10 12V4M5 20h14" />
                  </svg>
                  <p className="text-sm">
                    {file ? (
                      <span className="font-medium text-green-600">
                        {file.name}
                      </span>
                    ) : (
                      "Click to upload or drag & drop"
                    )}
                  </p>
                  <p className="text-xs text-gray-400">
                    PDF, PNG, JPG, JPEG (Max 5MB)
                  </p>
                </div>
                <input type="file" className="hidden" onChange={handleFileChange} />
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:ring-4 focus:ring-green-300 transition"
          >
            Create Record
          </button>
        </form>
      </div>
    </div>
  );
}
