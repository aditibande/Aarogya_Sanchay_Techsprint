const mongoose = require("mongoose");

const HealthRecordSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["doctor_visit", "Lab-report", "Vaccination", "Prescription"], required: true },
    title: { type: String, required: true },
    description: { type: String },
    doctor: {
        name: String,
        hospital: String,
        specialization: String
    },
    date: { type: Date, required: true },
    fileUrl: String,
    files: [String],
    tags: [String]
}, { timestamps: true });

module.exports = mongoose.model("HealthRecord", HealthRecordSchema);
