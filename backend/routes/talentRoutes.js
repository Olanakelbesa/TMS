import express from "express";
import {
  createTalent,
  getTalents,
  getTalentById,
  updateTalent,
  deleteTalent,
  getTalentStats,
} from "../controllers/talentController.js";
import { verifyAdmin } from "../middleware/authMiddleware.js";

import { validate } from "../middleware/validationMiddleware.js";
import { talentCreateSchema, talentUpdateSchema } from "../config/schemas.js";

const router = express.Router();

// Stats route (Admin only, put BEFORE /:id)
router.get("/stats", verifyAdmin, getTalentStats);

// Public routes
router.get("/", getTalents);
router.get("/:id", getTalentById);
router.post("/", validate(talentCreateSchema), createTalent);

// Admin-protected routes
router.put("/:id", verifyAdmin, validate(talentUpdateSchema), updateTalent);
router.delete("/:id", verifyAdmin, deleteTalent);

export default router;
