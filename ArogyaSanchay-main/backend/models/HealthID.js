const mongoose = require("mongoose");

const familyMemberSchema = new mongoose.Schema({
  name: String,
  age: Number,
  relation: String,
});

const healthIDSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    gender: { type: String, required: true },
    dob: { type: String, required: true },
    aadhar: { type: String, required: true },
    phone: { type: String, required: true },
    photoURL: { type: String },
    address: { type: String, required: true },
    occupation: { type: String, required: true },
    familyCount: { type: Number, default: 0 },
    familyMembers: [familyMemberSchema],
    language: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HealthID", healthIDSchema);
