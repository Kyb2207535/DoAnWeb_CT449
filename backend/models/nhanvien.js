const mongoose = require("mongoose");

const NhanVienSchema = new mongoose.Schema({
  maNhanVien: { type: String, required: true, unique: true },
  hoTen: { type: String, required: true },
  password: { type: String, required: true },
  chucVu: { type: String },
  diaChi: { type: String },
  soDienThoai: { type: String },
});

module.exports = mongoose.model("NhanVien", NhanVienSchema);
