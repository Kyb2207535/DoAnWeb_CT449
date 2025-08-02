const NhaXuatBan = require("../models/nhaxuatban");

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
    const newNXB = new NhaXuatBan(req.body);
    await newNXB.save();
    res.status(201).json(newNXB);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  const updated = await NhaXuatBan.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!updated) return res.status(404).json({ error: "Không tìm thấy NXB" });
  res.json(updated);
};

exports.remove = async (req, res) => {
  const deleted = await NhaXuatBan.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Không tìm thấy NXB" });
  res.json({ message: "Đã xóa NXB" });
};
