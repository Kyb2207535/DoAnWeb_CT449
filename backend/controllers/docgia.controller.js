const DocGia = require("../models/docgia");

exports.getAll = async (req, res) => {
  const list = await DocGia.find();
  res.json(list);
};

exports.getOne = async (req, res) => {
  const docGia = await DocGia.findById(req.params.id);
  if (!docGia) return res.status(404).json({ error: "Không tìm thấy" });
  res.json(docGia);
};

exports.create = async (req, res) => {
  try {
    const newDocGia = new DocGia(req.body);
    await newDocGia.save();
    res.status(201).json(newDocGia);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  const updated = await DocGia.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!updated) return res.status(404).json({ error: "Không tìm thấy" });
  res.json(updated);
};

exports.remove = async (req, res) => {
  const deleted = await DocGia.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Không tìm thấy" });
  res.json({ message: "Đã xóa" });
};
