import express from "express";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  createManualUpiOrder
} from "../controllers/order.controller.js";

import { requireAuth } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

router.post("/", requireAuth, createOrder);
router.get("/my", requireAuth, getMyOrders);
router.get("/", requireAuth, requireAdmin, getAllOrders);
router.patch("/:id", requireAuth, requireAdmin, updateOrderStatus);
router.delete("/:id", requireAuth, requireAdmin, deleteOrder);
router.post("/manual-upi",requireAuth,createManualUpiOrder);

export default router;