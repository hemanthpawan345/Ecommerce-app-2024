import express from "express";
import { isAdmin, requiresSignIn } from "../middlewares/authMiddlewares.js";
import {
  createCategoryController,
  updateCategoryController,
  categoryController,
  singleCategoryController,
  deleteCategoryController,
} from "../controllers/categoryController.js";

//router
const router = express.Router();

//routes
//create category
router.post(
  "/create-category",
  requiresSignIn,
  isAdmin,
  createCategoryController
);

//update category
router.put(
  "/update-category/:id",
  requiresSignIn,
  isAdmin,
  updateCategoryController
);

//get all category
router.get("/categories", categoryController);

//get single category
router.get("/single-category/:slug", singleCategoryController);

//delete category
router.delete(
  "/delete-category/:id",
  requiresSignIn,
  isAdmin,
  deleteCategoryController
);

export default router;
