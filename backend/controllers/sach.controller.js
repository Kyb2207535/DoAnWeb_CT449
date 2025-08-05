const Sach = require("../models/sach");
const { generateIncrementalCode } = require("../utils/code.generator");
const path = require("path");
const fs = require("fs").promises;
const uploadDir = path.join(__dirname, "..", "public", "image", "book_images");

fs.mkdir(uploadDir, { recursive: true }).catch((err) =>
  console.error("Error creating upload directory:", err)
);

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

    let imageName = "";
    if (req.file) {
      imageName = `${Date.now()}_${req.file.originalname}`;
      const imagePath = path.join(uploadDir, imageName);
      await fs.writeFile(imagePath, req.file.buffer);
    }

    const newSach = new Sach({
      maSach,
      tenSach: req.body.tenSach,
      donGia: req.body.donGia,
      soQuyen: req.body.soQuyen,
      namXuatBan: req.body.namXuatBan,
      maNXB: req.body.maNXB,
      tacGia: req.body.tacGia,
      image: imageName,
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

    let imageName = existing.image;
    if (req.file) {
      // Xóa hình ảnh cũ nếu có
      if (existing.image) {
        const oldImagePath = path.join(uploadDir, existing.image);
        await fs
          .unlink(oldImagePath)
          .catch((err) => console.error("Error deleting old image:", err));
      }
      // Lưu hình ảnh mới
      imageName = `${Date.now()}_${req.file.originalname}`;
      const imagePath = path.join(uploadDir, imageName);
      await fs.writeFile(imagePath, req.file.buffer);
    } else if (req.body.image === "") {
      // Xóa hình ảnh nếu client gửi yêu cầu xóa
      if (existing.image) {
        const oldImagePath = path.join(uploadDir, existing.image);
        await fs
          .unlink(oldImagePath)
          .catch((err) => console.error("Error deleting old image:", err));
      }
      imageName = "";
    }

    // Không cho cập nhật maSach
    const { maSach, ...updates } = req.body;
    Object.assign(existing, {
      ...updates,
      image: imageName,
    });

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
