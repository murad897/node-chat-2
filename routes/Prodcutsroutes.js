const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const productController = require("../controllers/productController");

router.get("/search/result", auth.verifyToken, productController.getSearchResult);
router.post("/search", auth.verifyToken, productController.inputPostValue);
// get all products
router.get("/", auth.verifyToken, productController.prodcuts_getall);
//create product
router.post("/create", auth.verifyToken, productController.product_create_post);
//deleteAll product
router.delete("/delete/:ids", auth.verifyToken, productController.product_delete_all);
//update/edit product
router.patch("/:id", auth.verifyToken, productController.product_edit);
//get by id
router.get("/:id", auth.verifyToken, productController.prodcuts_getEach);
//delete by id
// router.delete(
//   "/delete/:id",
//   auth.verifyToken,
//   productController.delete_each_product
// );
module.exports = router;
