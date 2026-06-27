const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.post("/", authenticate, authorize("ADMIN"), productController.createProduct);
router.put("/:id", authenticate, authorize("ADMIN"), productController.updateProduct);
router.delete("/:id", authenticate, authorize("ADMIN"), productController.deleteProduct);

module.exports = router;
