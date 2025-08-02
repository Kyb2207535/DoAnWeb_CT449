// backend/models/MuonTra.js
const mongoose = require("mongoose");

const MuonTraSchema = new mongoose.Schema({
  maDocGia: { type: String, required: true },
  maSach: { type: String, required: true },
  ngayMuon: { type: Date, required: true },
  soNgayMuon: { type: Number, required: true, default: 7 }, 
  ngayTra: { type: Date },
  ngayTraThucTe: { type: Date },
});

module.exports = mongoose.model("MuonTra", MuonTraSchema);
