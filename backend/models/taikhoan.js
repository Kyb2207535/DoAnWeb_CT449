const mongoose = require("mongoose");

const TaiKhoanSchema = new mongoose.Schema({
  maTaiKhoan: { type: String, required: true, unique: true },
  dienThoai: { type: String, required: true, unique: true },
  matKhau: { type: String, required: true }, 
  maDocGia: { type: String, ref: "DocGia", required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("TaiKhoan", TaiKhoanSchema);
