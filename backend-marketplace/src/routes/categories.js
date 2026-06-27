const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

router.get("/", categoryController.getAllCategories);
router.post("/", authenticate, authorize("ADMIN"), categoryController.createCategory);

module.exports = router;
