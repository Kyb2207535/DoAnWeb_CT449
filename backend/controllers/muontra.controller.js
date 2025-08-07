const MuonTra = require("../models/muontra");
const Sach = require("../models/sach");

exports.getAll = async (req, res) => {
  const data = await MuonTra.find();
  res.json(data);
};

exports.getOne = async (req, res) => {
  const muontra = await MuonTra.findById(req.params.id);
  if (!muontra)
    return res.status(404).json({ error: "Không tìm thấy bản ghi" });
  res.json(muontra);
};

exports.create = async (req, res) => {
  try {
    const { maDocGia, maSach, ngayMuon, soNgayMuon } = req.body;

    const ngayMuonDate = new Date(ngayMuon);
    const soNgay = soNgayMuon || 7;

    const ngayTra = new Date(ngayMuonDate);
    ngayTra.setDate(ngayTra.getDate() + soNgay);

    const newMT = new MuonTra({
      maDocGia,
      maSach,
      ngayMuon: ngayMuonDate,
      soNgayMuon: soNgay,
      ngayTra: ngayTra,
      ngayTraThucTe: null,
    });

    await newMT.save();
    res.status(201).json(newMT);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  const muontra = await MuonTra.findById(req.params.id);
  if (!muontra)
    return res.status(404).json({ error: "Không tìm thấy bản ghi" });

  muontra.ngayTraThucTe = req.body.ngayTraThucTe || new Date();
  await muontra.save();

  res.json(muontra);
};

exports.remove = async (req, res) => {
  const deleted = await MuonTra.findByIdAndDelete(req.params.id);
  if (!deleted)
    return res.status(404).json({ error: "Không tìm thấy bản ghi" });
  res.json({ message: "Đã xóa bản ghi mượn sách" });
};
