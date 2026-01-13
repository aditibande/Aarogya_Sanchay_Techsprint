const mongoose = require("mongoose");

const shareLinkSchema = new mongoose.Schema({
  recordId: { type: mongoose.Schema.Types.ObjectId, ref: "HealthRecord" },
  token: String,
  expiresAt: Date
});

module.exports = mongoose.model("ShareLink", shareLinkSchema);
