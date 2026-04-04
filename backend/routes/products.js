const router = require("express").Router();
const upload = require("../config/multer");
const { getProducts, createProduct, updateProduct, deleteProduct} = require("../controllers/productController");

router.get("/", getProducts);
router.post("/", upload.single("image"), createProduct)
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;