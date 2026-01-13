const mongoose = require("mongoose");
const {v4: uuidv4} = require('uuid');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    role: {
        type: String,
        enum: ["migrant", "doctor", "govt", "admin"],
        required: true
    },
    email: {
        type: String,
        unique: true,
        sparse: true
    },
    phone: {
        type: String,
        unique: true,
        sparse: true
    },
    password: { type: String },
    language: { type: String },

    healthId: {
        type: String,

        unique: true,
        sparse: true,
    },
    qrCode: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
