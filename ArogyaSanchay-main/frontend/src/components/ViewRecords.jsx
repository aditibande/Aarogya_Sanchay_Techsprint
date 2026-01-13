import { useEffect, useState } from "react";
import api, { IMAGE_BASE_URL } from "../api";

export default function ViewRecords() {
  const [records, setRecords] = useState([]);
  const [searchParams, setSearchParams] = useState({
    type: "",
    doctor: "",
    hospital: "",
    tag: "",
    from: "",
    to: "",
  });
  const [editingRecord, setEditingRecord] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    type: "",
    date: "",
    doctorName: "",
    hospital: "",
    tags: "",
    file: null,
  });
  const [shareDropdowns, setShareDropdowns] = useState({});
  const [pdfViewer, setPdfViewer] = useState(null);
  
  const fetchRecords = async (params = {}) => {
    try {
      const token = localStorage.getItem("token");
      const query = new URLSearchParams(params).toString();
      const res = await api.get(`/health-records/searchRecords?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecords(res.data);
    } catch (err) {
      console.error("Fetch records failed:", err.response?.data || err.message);
      setRecords([]);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleSearchChange = (e) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    fetchRecords(searchParams);
  };

  const handleDelete = async (recordId) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/health-records/deleteRecord/${recordId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecords(records.filter((r) => r._id !== recordId));
    } catch (err) {
      console.error("Delete failed:", err.response?.data || err.message);
      alert("Failed to delete record.");
    }
  };

  const toggleShareDropdown = (recordId) => {
    setShareDropdowns(prev => ({
      ...prev,
      [recordId]: !prev[recordId]
    }));
  };

  const closeAllDropdowns = () => {
    setShareDropdowns({});
  };

  const handleCopyLink = async (recordId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.post(`/health-records/shareRecord/${recordId}/share`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      await navigator.clipboard.writeText(res.data.link);
      
      alert(`Link copied to clipboard!\nExpires at: ${new Date(res.data.expiresAt).toLocaleString()}`);
      closeAllDropdowns();
    } catch (err) {
      console.error("Copy link failed:", err.response?.data || err.message);
      alert("Failed to generate shareable link.");
    }
  };

  const handleViewPDF = (record) => {
    let fileUrl = null;
    
    if (record.files && record.files.length > 0) {
      fileUrl = record.files[0];
    }
    else if (record.fileUrl) {
      fileUrl = record.fileUrl;
    }
    
    if (fileUrl) {
      setPdfViewer({
        url: `${IMAGE_BASE_URL}${fileUrl}`,
        title: record.title
      });
      closeAllDropdowns();
    } else {
      alert("No file available for this record.");
    }
  };

  const handleDownloadPDF = (record) => {
    let fileUrl = null;
    
    if (record.files && record.files.length > 0) {
      fileUrl = record.files[0];
    }
    else if (record.fileUrl) {
      fileUrl = record.fileUrl;
    }
    
    if (fileUrl) {
      const link = document.createElement('a');
      link.href = `${IMAGE_BASE_URL}${fileUrl}`;
      link.download = `${record.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}`;
      link.target = '_blank'; 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      closeAllDropdowns();
    } else {
      alert("No file available for this record.");
    }
  };

  const openEditModal = (record) => {
    setEditingRecord(record);
    setEditForm({
      title: record.title,
      type: record.type,
      date: record.date?.split("T")[0] || "",
      doctorName: record.doctor?.name || "",
      hospital: record.doctor?.hospital || "",
      tags: record.tags?.join(", ") || "",
      file: null,
    });
  };

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setEditForm({ ...editForm, file: files[0] });
    } else {
      setEditForm({ ...editForm, [name]: value });
    }
  };

  const handleEditSubmit = async () => {
    if (!editingRecord) return;
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", editForm.title);
      formData.append("type", editForm.type);
      formData.append("date", editForm.date);
      formData.append("doctor[name]", editForm.doctorName);
      formData.append("doctor[hospital]", editForm.hospital);
      formData.append("tags", editForm.tags.split(",").map(t => t.trim()));
      if (editForm.file) formData.append("file", editForm.file);

      const res = await api.put(`/health-records/updateRecord/${editingRecord._id}`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      setRecords(records.map((r) => (r._id === editingRecord._id ? res.data : r)));
      setEditingRecord(null);
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
      alert("Failed to update record.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen" onClick={closeAllDropdowns}>
      <h1 className="text-2xl font-bold mb-4">My Health Records</h1>

      {/* Search Panel */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input type="text" name="type" placeholder="Type" value={searchParams.type} onChange={handleSearchChange} className="px-3 py-2 border rounded-lg" />
        <input type="text" name="doctor" placeholder="Doctor" value={searchParams.doctor} onChange={handleSearchChange} className="px-3 py-2 border rounded-lg" />
        <input type="text" name="hospital" placeholder="Hospital" value={searchParams.hospital} onChange={handleSearchChange} className="px-3 py-2 border rounded-lg" />
        <input type="text" name="tag" placeholder="Tag" value={searchParams.tag} onChange={handleSearchChange} className="px-3 py-2 border rounded-lg" />
        <input type="date" name="from" value={searchParams.from} onChange={handleSearchChange} className="px-3 py-2 border rounded-lg" />
        <input type="date" name="to" value={searchParams.to} onChange={handleSearchChange} className="px-3 py-2 border rounded-lg" />
        <button onClick={handleSearch} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Search</button>
      </div>

      {/* Records Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {records.length === 0 ? (
          <p className="text-gray-500 col-span-full">No records found.</p>
        ) : (
          records.map((r) => (
            <div key={r._id} className="bg-white rounded-lg shadow p-4 flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-semibold mb-1">{r.title}</h2>
                <p className="text-sm text-gray-600 mb-1">Type: {r.type}</p>
                <p className="text-sm text-gray-600 mb-1">Date: {new Date(r.date).toLocaleDateString()}</p>
                {r.doctor?.name && <p className="text-sm text-gray-600 mb-1">Doctor: {r.doctor.name}</p>}
                {r.doctor?.hospital && <p className="text-sm text-gray-600 mb-1">Hospital: {r.doctor.hospital}</p>}
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {/* Keep original download link if it was working */}
                {r.fileUrl && (
                  <a href={`${IMAGE_BASE_URL}${r.fileUrl}`} target="_blank" rel="noopener noreferrer" className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm">Download (Original)</a>
                )}
                
                <button onClick={() => openEditModal(r)} className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 text-sm">Edit</button>
                <button onClick={() => handleDelete(r._id)} className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm">Delete</button>
                
                {/* Enhanced Share Button with Dropdown */}
                <div className="relative">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleShareDropdown(r._id);
                    }} 
                    className="px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm flex items-center gap-1"
                  >
                    Share ▼
                  </button>
                  
                  {/* Share Dropdown Menu */}
                  {shareDropdowns[r._id] && (
                    <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg z-50 min-w-40">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyLink(r._id);
                        }}
                        className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm border-b"
                      >
                        🔗 Copy Link
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewPDF(r);
                        }}
                        className={`block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm border-b ${!r.fileUrl ? 'text-gray-400 cursor-not-allowed' : ''}`}
                        disabled={!r.fileUrl}
                      >
                        👁️ View File
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadPDF(r);
                        }}
                        className={`block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm ${!r.fileUrl ? 'text-gray-400 cursor-not-allowed' : ''}`}
                        disabled={!r.fileUrl}
                      >
                        📥 Download File
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* PDF Viewer Modal */}
      {pdfViewer && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl h-5/6 flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold">{pdfViewer.title}</h2>
              <button
                onClick={() => setPdfViewer(null)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                ✕ Close
              </button>
            </div>
            <div className="flex-1 p-4">
              <iframe
                src={pdfViewer.url}
                className="w-full h-full border rounded"
                title={pdfViewer.title}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingRecord && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Record</h2>
            <input type="text" name="title" placeholder="Title" value={editForm.title} onChange={handleEditChange} className="w-full mb-2 px-3 py-2 border rounded" />
            <input type="text" name="type" placeholder="Type" value={editForm.type} onChange={handleEditChange} className="w-full mb-2 px-3 py-2 border rounded" />
            <input type="date" name="date" value={editForm.date} onChange={handleEditChange} className="w-full mb-2 px-3 py-2 border rounded" />
            <input type="text" name="doctorName" placeholder="Doctor Name" value={editForm.doctorName} onChange={handleEditChange} className="w-full mb-2 px-3 py-2 border rounded" />
            <input type="text" name="hospital" placeholder="Hospital" value={editForm.hospital} onChange={handleEditChange} className="w-full mb-2 px-3 py-2 border rounded" />
            <input type="text" name="tags" placeholder="Tags (comma separated)" value={editForm.tags} onChange={handleEditChange} className="w-full mb-2 px-3 py-2 border rounded" />
            <input type="file" name="file" onChange={handleEditChange} className="w-full mb-4" />

            <div className="flex justify-end gap-2">
              <button onClick={() => setEditingRecord(null)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
              <button onClick={handleEditSubmit} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
