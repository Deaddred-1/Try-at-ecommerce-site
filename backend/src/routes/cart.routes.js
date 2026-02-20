import express from "express";
import {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
} from "../controllers/cart.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", requireAuth, getCart);
router.post("/add", requireAuth, addToCart);
router.patch("/update", requireAuth, updateQuantity);
router.delete("/:productId", requireAuth, removeFromCart);

export default router;

