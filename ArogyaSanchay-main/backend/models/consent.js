import mongoose from "mongoose";

const ConsentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    grantedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    recordAccess: [String],
    validTill: Date
}, { timestamps: true });

module.exports = mongoose.model("Consent", ConsentSchema);