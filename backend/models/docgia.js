const mongoose = require("mongoose");

const DocGiaSchema = new mongoose.Schema({
  maDocGia: { type: String, required: true, unique: true },
  hoLot: String,
  ten: String,
  ngaySinh: Date,
  phai: { type: String, enum: ["Nam", "Nữ"] },
  diaChi: String,
  dienThoai: String,
});

module.exports = mongoose.model("DocGia", DocGiaSchema);
