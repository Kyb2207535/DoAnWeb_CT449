const express = require('express');
const router = express.Router();
const docGiaController = require("../controllers/docgia.controller");

router.get('/', docGiaController.getAll);
router.get('/:id', docGiaController.getOne);
router.post('/', docGiaController.create);
router.put('/:id', docGiaController.update);
router.delete('/:id', docGiaController.remove);

module.exports = router;
