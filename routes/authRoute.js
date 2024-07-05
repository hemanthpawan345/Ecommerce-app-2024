import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  updateOrderStatusController,
} from "../controllers/authController.js";
import { isAdmin, requiresSignIn } from "../middlewares/authMiddlewares.js";

//router object
const router = express.Router();

// --------routing-------- //

//REGISTER || METHOD POST
router.post("/register", registerController);

//LOGIN || POST
router.post("/login", loginController);

//forgot password || METHOD POST
router.post("/forgot-password", forgotPasswordController);

//test
router.get("/test", requiresSignIn, isAdmin, testController);

//protected user auth-route
router.get("/user-auth", requiresSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

//protected admin auth-route
router.get("/admin-auth", requiresSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

//user update
router.put("/update-profile", requiresSignIn, updateProfileController);

//user oders
router.get("/orders", requiresSignIn, getOrdersController);

//admin orders
router.get("/all-orders", requiresSignIn, isAdmin, getAllOrdersController);

//oder status update
router.put(
  "/order-status/:orderId",
  requiresSignIn,
  isAdmin,
  updateOrderStatusController
);

export default router;
