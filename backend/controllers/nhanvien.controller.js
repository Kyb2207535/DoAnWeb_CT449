const NhanVien = require("../models/nhanvien");
const { generateIncrementalCode } = require("../utils/code.generator");
const bcrypt = require("bcrypt");

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
    const maNhanVien = await generateIncrementalCode(
      NhanVien,
      "maNhanVien",
      "NV",
      3
    );

    // Mã hóa mật khẩu trước khi lưu
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newNV = new NhanVien({
      maNhanVien,
      ...req.body,
      password: hashedPassword, // ghi đè mật khẩu bằng hash
    });

    await newNV.save();
    res.status(201).json(newNV);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    console.log("req.body:", req.body); // Log dữ liệu đầu vào

    const existing = await NhanVien.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: "Không tìm thấy nhân viên" });
    }

    const { maNhanVien, password, ...otherUpdates } = req.body;

    // Cập nhật các trường khác
    Object.assign(existing, otherUpdates);

    // Nếu có mật khẩu mới thì mã hóa
    if (password) {
      if (password.trim() === "") {
        return res.status(400).json({ error: "Mật khẩu không được để trống" });
      }
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        existing.password = hashedPassword;
        console.log("Hashed password:", hashedPassword); // Log mật khẩu đã mã hóa
      } catch (hashError) {
        return res
          .status(500)
          .json({ error: "Lỗi khi mã hóa mật khẩu: " + hashError.message });
      }
    } else {
      console.log("Không có mật khẩu mới, giữ nguyên mật khẩu cũ");
    }

    const updated = await existing.save();
    console.log("Updated document:", updated); // Log tài liệu sau khi lưu
    res.json(updated);
  } catch (err) {
    console.error("Lỗi trong hàm update:", err); // Log lỗi chi tiết
    res.status(400).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  const data = await NhanVien.findByIdAndDelete(req.params.id);
  if (!data)
    return res.status(404).json({ message: "Không tìm thấy nhân viên" });
  res.json({ message: "Xoá thành công" });
};
