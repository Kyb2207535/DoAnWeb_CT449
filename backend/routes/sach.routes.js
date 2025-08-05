const express = require("express");
const router = express.Router();
const sachController = require("../controllers/sach.controller");
const upload = require("../middlewares/multerConfig");

router.get("/", sachController.getAll);
router.get("/:id", sachController.getOne);
router.post("/", upload.single("image"), sachController.create);
router.put("/:id", upload.single("image"), sachController.update);
router.delete("/:id", sachController.remove);

module.exports = router;
