const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const admin = require("../firebaseAdmin");
const { v4: uuidv4 } = require("uuid");
require('dotenv').config()

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET

router.post("/signup", async (req, res) => {
    const { name, role, email, phone, password, language } = req.body;


    if (!name || !role || (!email && !phone) || !password) {
        return res.status(400).json({ message: "Name, role, email/phone, and password are required." });
    }
    try {
        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email or phone already exists." });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        let healthId;
        if (role.toLowerCase() === "migrant") {
            healthId = "MIG-" + uuidv4().slice(0, 8);
        }
        const newUser = await new User({
            name,
            role,
            email,
            phone,
            password: hashedPassword,
            language,
            healthId,
        });

        await newUser.save();
        
        res.status(201).json({ message: "User registered successfully", healthId });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});


router.post("/login", async (req, res) => {
    const { email, phone, password } = req.body;
    if ((!email && !phone) || !password) {
        return res.status(400).json({ message: "Email/phone and password are required." });
    }
    try {
        const user = await User.findOne({ $or: [{ email }, { phone }] });
        if (!user) {
            return res.status(400).json({ message: "Invalid email/phone or password." });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email/phone or password." });
        }
        const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token,
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: 'Strict'
            });

        res.status(200).json({
            message: "Login successful", token,
            user: {
                id: user._id,
                name: user.name,
                role: user.role,
                email: user.email,
                phone: user.phone,
                healthId: user.healthId,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});


router.post("/phone-login", async (req, res) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({ message: "ID token is required." });
        }

        const decoded = await admin.auth().verifyIdToken(idToken);

        const phoneFromToken =
            decoded.phone_number || decoded.firebase?.identities?.phone?.[0];

        if (!phoneFromToken) {
            return res.status(400).json({ message: "Phone number not found in token." });
        }

        let user = await User.findOne({ phone: phoneFromToken });
        if (!user) {
            user = new User({ phone: phoneFromToken, role: "migrant" });
            await user.save();
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name || "New User",
                phone: user.phone,
                role: user.role,
                healthId: user.healthId,
            }
        });

    } catch (error) {
        console.error("Backend error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


router.post("/logout", (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'Strict'
    });
    res.status(200).json({ message: "Logout successful" });
});




module.exports = router;



