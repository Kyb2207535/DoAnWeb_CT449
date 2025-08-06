const express = require("express");
const bcrypt = require("bcrypt");
const { MongoClient } = require("mongodb");
const router = express.Router();

// MongoDB connection
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "quanlymuonsach";
let db;

async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db(dbName);
  }
  return db;
}

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { dienThoai, password } = req.body;

  // Validate request body
  if (!dienThoai || !password) {
    return res
      .status(400)
      .json({ error: "Please enter all required information." });
  }

  try {
    const db = await connectDB();
    const taiKhoanCollection = db.collection("taikhoans");
    const docGiaCollection = db.collection("docgias");

    // Find account by dienThoai
    const account = await taiKhoanCollection.findOne({ dienThoai });
    if (!account) {
      return res
        .status(401)
        .json({ error: "Login failed. Please check your credentials." });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, account.matKhau);
    if (!isMatch) {
      return res
        .status(401)
        .json({ error: "Login failed. Please check your credentials." });
    }

    // Get DocGia info by maDocGia
    const docGia = await docGiaCollection.findOne({
      maDocGia: account.maDocGia,
    });
    if (!docGia) {
      return res.status(404).json({ error: "User not found." });
    }

    // Return user data (excluding password)
    const { matKhau, ...accountData } = account;
    const { _id, ...docGiaData } = docGia;
    res.status(200).json({ ...docGiaData, maTaiKhoan: account.maTaiKhoan });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed. Please try again later." });
  }
});

module.exports = router;
