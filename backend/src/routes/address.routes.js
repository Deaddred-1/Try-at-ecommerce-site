import express from "express";
import {
  getAddresses,
  addAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controllers/address.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", requireAuth, getAddresses);
router.post("/", requireAuth, addAddress);
router.delete("/:id", requireAuth, deleteAddress);
router.patch("/:id/default", requireAuth, setDefaultAddress);

export default router;
