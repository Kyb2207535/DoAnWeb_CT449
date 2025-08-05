const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const config = require("./config");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/image", express.static(path.join(__dirname, "public/image")));

// Kết nối MongoDB
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Đã kết nối MongoDB"))
  .catch((err) => console.error("MongoDB lỗi:", err));

// Import routes
const docGiaRoutes = require("./routes/docgia.routes");
const sachRoutes = require("./routes/sach.routes");
const nxbRoutes = require("./routes/nhaxuatban.routes");
const muonTraRoutes = require("./routes/muontra.routes");
const nhanVienRoutes = require("./routes/nhanvien.routes");
app.use("/image", express.static(path.join(__dirname, "public/image")));

// Gắn route
app.use("/api/docgia", docGiaRoutes);
app.use("/api/sach", sachRoutes);
app.use("/api/nhaxuatban", nxbRoutes);
app.use("/api/muontra", muonTraRoutes);
app.use("/api/nhanvien", nhanVienRoutes);

app.listen(config.port, () => {
  console.log(`Server đang chạy tại http://localhost:${config.port}`);
});

