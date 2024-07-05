import express from "express";
import {
  createProductController,
  getProductsController,
  singleProductController,
  productPhotoController,
  deleteProductController,
  updateProductController,
  filterProductsController,
  productCountController,
  productListController,
  searchProductController,
  relatedProductsController,
  categoryProductsController,
  braintreeTokenController,
  braintreePaymentController,
} from "../controllers/productController.js";
import { isAdmin, requiresSignIn } from "../middlewares/authMiddlewares.js";
import formidable from "express-formidable";
const router = express.Router();

// routes

//create-product
router.post(
  "/create-product",
  requiresSignIn,
  isAdmin,
  formidable(),
  createProductController
);

//get-all products
router.get("/get-products", getProductsController);

//single product
router.get("/single-product/:slug", singleProductController);

//produc photo
router.get("/product-photo/:pid", productPhotoController);

//filter product
router.post("/product-filters", filterProductsController);

//search product
router.get("/search/:keyword", searchProductController);

//delete
router.delete(
  "/delete-product/:pid",
  // requiresSignIn,
  // isAdmin,
  deleteProductController
);

//update product
router.put(
  "/update-product/:pid",
  requiresSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

//product count
router.get("/product-count", productCountController);

//product per page
router.get("/product-list/:page", productListController);

//related products
router.get("/related-products/:pid/:cid", relatedProductsController);

//category wise product
router.get("/category-product/:slug", categoryProductsController);

//payment route

//token
router.get("/braintree/token", braintreeTokenController);

//payments
router.post("/braintree/payment", requiresSignIn, braintreePaymentController);



export default router;
