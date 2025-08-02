const NhanVien = require("../models/nhanvien");

exports.getAll = async (req, res) => {
  const data = await NhanVien.find();
  res.json(data);
};

exports.getOne = async (req, res) => {
  const data = await NhanVien.findById(req.params.id);
  if (!data)
    return res.status(404).json({ message: "Không tìm thấy nhân viên" });
  res.json(data);
};

exports.create = async (req, res) => {
  try {
    const newNV = new NhanVien(req.body);
    await newNV.save();
    res.status(201).json(newNV);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  const data = await NhanVien.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!data)
    return res.status(404).json({ message: "Không tìm thấy nhân viên" });
  res.json(data);
};

exports.delete = async (req, res) => {
  const data = await NhanVien.findByIdAndDelete(req.params.id);
  if (!data)
    return res.status(404).json({ message: "Không tìm thấy nhân viên" });
  res.json({ message: "Xoá thành công" });
};
