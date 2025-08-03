const Sach = require("../models/sach");
const { generateIncrementalCode } = require("../utils/code.generator");

exports.getAll = async (req, res) => {
  const saches = await Sach.find();
  res.json(saches);
};

exports.getOne = async (req, res) => {
  const sach = await Sach.findById(req.params.id);
  if (!sach) return res.status(404).json({ error: "Không tìm thấy sách" });
  res.json(sach);
};

exports.create = async (req, res) => {
  try {
    const maSach = await generateIncrementalCode(Sach, "maSach", "S", 3);

    const newSach = new Sach({
      maSach,
      tenSach: req.body.tenSach,
      donGia: req.body.donGia,
      soQuyen: req.body.soQuyen,
      namXuatBan: req.body.namXuatBan,
      maNXB: req.body.maNXB,
      tacGia: req.body.tacGia, 
    });

    await newSach.save();
    res.status(201).json(newSach);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const existing = await Sach.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: "Không tìm thấy" });
    }

    // Không cho cập nhật maSach
    const { maSach, ...updates } = req.body;
    Object.assign(existing, updates);

    const updated = await existing.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  const deleted = await Sach.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Không tìm thấy sách" });
  res.json({ message: "Đã xóa sách" });
};
