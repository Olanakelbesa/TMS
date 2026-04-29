import express from "express";
import { loginAdmin, getMe } from "../controllers/authController.js";
import { verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.get("/me", verifyAdmin, getMe);

export default router;
