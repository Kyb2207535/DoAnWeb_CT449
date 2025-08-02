const mongoose = require("mongoose");

const SachSchema = new mongoose.Schema({
  maSach: { type: String, required: true, unique: true },
  tenSach: { type: String, required: true },
  donGia: Number,
  soQuyen: Number,
  namXuatBan: Number,
  maNXB: String, 
  tacGia: String, 
});

module.exports = mongoose.model("Sach", SachSchema);
