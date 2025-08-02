const express = require("express");
const router = express.Router();
const muonTraController = require("../controllers/muontra.controller");

router.get("/", muonTraController.getAll);
router.get("/:id", muonTraController.getOne);
router.post("/", muonTraController.create);
router.put("/:id", muonTraController.update);
router.delete("/:id", muonTraController.remove);

module.exports = router;
