const DocGia = require("../models/docgia");
const { generateIncrementalCode } = require("../utils/code.generator");

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
    const maDocGia = await generateIncrementalCode(DocGia, "maDocGia", "DG", 3);

    const newDocGia = new DocGia({
      maDocGia,
      hoLot: req.body.hoLot,
      ten: req.body.ten,
      ngaySinh: req.body.ngaySinh,
      phai: req.body.phai,
      diaChi: req.body.diaChi,
      dienThoai: req.body.dienThoai,
    });

    await newDocGia.save();
    res.status(201).json(newDocGia);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const existingDocGia = await DocGia.findById(req.params.id);
    if (!existingDocGia) {
      return res.status(404).json({ error: "Không tìm thấy" });
    }

    // Không cho phép cập nhật mã độc giả
    const { maDocGia, ...otherUpdates } = req.body;

    Object.assign(existingDocGia, otherUpdates);
    const updated = await existingDocGia.save();

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.remove = async (req, res) => {
  const deleted = await DocGia.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Không tìm thấy" });
  res.json({ message: "Đã xóa" });
};
