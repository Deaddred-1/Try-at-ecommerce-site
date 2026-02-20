import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", requireAuth, requireAdmin, createProduct);
router.patch("/:id", requireAuth, requireAdmin, updateProduct);
router.delete("/:id", requireAuth, requireAdmin, deleteProduct);

export default router;