const DocGia = require("../models/docgia");
const TaiKhoan = require("../models/taikhoan");
const bcrypt = require("bcrypt");

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

    // Tạo tài khoản với mật khẩu đã hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const maTaiKhoan = await generateIncrementalCode(
      TaiKhoan,
      "maTaiKhoan",
      "TK",
      3
    );
    const newTaiKhoan = new TaiKhoan({
      maTaiKhoan,
      dienThoai: req.body.dienThoai,
      matKhau: hashedPassword,
      maDocGia: maDocGia,
    });

    await newTaiKhoan.save();
    res.status(201).json({ docGia: newDocGia, taiKhoan: newTaiKhoan });
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

    const { maDocGia, ...otherUpdates } = req.body;
    Object.assign(existingDocGia, otherUpdates);
    const updated = await existingDocGia.save();

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.remove = async (req, res) => {
  try {
    const deletedDocGia = await DocGia.findByIdAndDelete(req.params.id);
    if (!deletedDocGia) {
      return res.status(404).json({ error: "Không tìm thấy độc giả" });
    }

    // Xóa bản ghi TaiKhoan liên quan dựa trên maDocGia
    const deletedTaiKhoan = await TaiKhoan.findOneAndDelete({
      maDocGia: deletedDocGia.maDocGia,
    });
    

    res.json({ message: "Đã xóa độc giả và tài khoản liên quan" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

