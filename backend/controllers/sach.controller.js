const Sach = require("../models/sach");

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
    const newSach = new Sach(req.body);
    await newSach.save();
    res.status(201).json(newSach);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  const updated = await Sach.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!updated) return res.status(404).json({ error: "Không tìm thấy sách" });
  res.json(updated);
};

exports.remove = async (req, res) => {
  const deleted = await Sach.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Không tìm thấy sách" });
  res.json({ message: "Đã xóa sách" });
};
