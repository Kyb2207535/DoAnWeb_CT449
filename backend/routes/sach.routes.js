const express = require("express");
const router = express.Router();
const sachController = require("../controllers/sach.controller");

router.get("/", sachController.getAll);
router.get("/:id", sachController.getOne);
router.post("/", sachController.create);
router.put("/:id", sachController.update);
router.delete("/:id", sachController.remove);

module.exports = router;
