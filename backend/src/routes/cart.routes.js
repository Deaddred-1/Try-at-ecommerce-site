import express from "express";
import {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.get("/", getCart);
router.post("/add", addToCart);
router.patch("/update", updateQuantity);
router.delete("/remove/:productId", removeFromCart);


export default router;

