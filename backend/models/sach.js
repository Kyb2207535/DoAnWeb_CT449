const mongoose = require("mongoose");

const SachSchema = new mongoose.Schema({
  maSach: {
    type: String,
    required: [true, "Book code is required"],
    unique: true,
  },
  tenSach: { type: String, required: [true, "Book name is required"] },
  donGia: { type: Number, min: 0 },
  soQuyen: { type: Number, min: 0 },
  namXuatBan: { type: Number, min: 1900 },
  maNXB: { type: String },
  tacGia: { type: String },
  image: { type: String },
});

module.exports = mongoose.model("Sach", SachSchema);
