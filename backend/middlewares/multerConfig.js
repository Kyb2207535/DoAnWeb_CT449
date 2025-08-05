const multer = require("multer");
const path = require("path");

// Cấu hình multer
const storage = multer.memoryStorage(); // Lưu tệp vào bộ nhớ tạm
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Chỉ chấp nhận file JPG hoặc PNG"));
    }
  },
});

module.exports = upload;
