const NhaXuatBan = require("../models/nhaxuatban");
const { generateIncrementalCode } = require("../utils/code.generator");

exports.getAll = async (req, res) => {
  const list = await NhaXuatBan.find();
  res.json(list);
};

exports.getOne = async (req, res) => {
  const nxb = await NhaXuatBan.findById(req.params.id);
  if (!nxb) return res.status(404).json({ error: "Không tìm thấy NXB" });
  res.json(nxb);
};

exports.create = async (req, res) => {
  try {
    const maNXB = await generateIncrementalCode(NhaXuatBan, "maNXB", "NXB", 3);

    const newNXB = new NhaXuatBan({
      maNXB,
      tenNXB: req.body.tenNXB,
      diaChi: req.body.diaChi,
    });

    await newNXB.save();
    res.status(201).json(newNXB);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const existing = await NhaXuatBan.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: "Không tìm thấy" });
    }

    // Không cho cập nhật maNXB
    const { maNXB, ...updates } = req.body;
    Object.assign(existing, updates);

    const updated = await existing.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  const deleted = await NhaXuatBan.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Không tìm thấy NXB" });
  res.json({ message: "Đã xóa NXB" });
};
