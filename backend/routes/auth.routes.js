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

  // Kiểm tra xem có cung cấp đầy đủ thông tin đăng nhập không
  if (!dienThoai || !password) {
    return res
      .status(400)
      .json({ error: "Vui lòng nhập đầy đủ thông tin đăng nhập." });
  }

  try {
    const db = await connectDB();
    const taiKhoanCollection = db.collection("taikhoans");
    const nhanVienCollection = db.collection("nhanviens");
    const docGiaCollection = db.collection("docgias");

    // 🔍 Kiểm tra xem có phải là NhanVien (Admin) không
    const nhanVien = await nhanVienCollection.findOne({
      soDienThoai: dienThoai,
    });
    if (nhanVien) {
      const isMatch = await bcrypt.compare(password, nhanVien.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Sai thông tin đăng nhập." });
      }

      // Trả về thông tin admin với role
      return res.status(200).json({
        role: "admin",
        maNhanVien: nhanVien.maNhanVien,
        hoTen: nhanVien.hoTen,
      });
    }

    // 🔍 Kiểm tra TaiKhoan (User)
    const account = await taiKhoanCollection.findOne({ dienThoai });
    if (!account) {
      return res.status(401).json({ error: "Sai thông tin đăng nhập." });
    }

    const isMatch = await bcrypt.compare(password, account.matKhau);
    if (!isMatch) {
      return res.status(401).json({ error: "Sai thông tin đăng nhập." });
    }

    // Lấy thông tin độc giả
    const docGia = await docGiaCollection.findOne({
      maDocGia: account.maDocGia,
    });
    if (!docGia) {
      return res.status(404).json({ error: "Không tìm thấy độc giả." });
    }

    // ✅ Đăng nhập thành công → trả về role và toàn bộ thông tin docGia (trừ _id) cùng maTaiKhoan
    const { _id, ...docGiaData } = docGia;
    return res.status(200).json({
      role: "user",
      ...docGiaData,
      maTaiKhoan: account.maTaiKhoan,
    });
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    return res
      .status(500)
      .json({ error: "Đăng nhập thất bại. Vui lòng thử lại sau." });
  }
});

module.exports = router;
