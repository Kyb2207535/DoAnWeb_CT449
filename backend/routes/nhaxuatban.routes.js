const express = require("express");
const router = express.Router();
const nxbController = require("../controllers/nhaxuatban.controller");

router.get("/", nxbController.getAll);
router.get("/:id", nxbController.getOne);
router.post("/", nxbController.create);
router.put("/:id", nxbController.update);
router.delete("/:id", nxbController.remove);

module.exports = router;
