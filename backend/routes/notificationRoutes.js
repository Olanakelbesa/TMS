import express from "express";
import { 
  getNotifications, 
  markAsRead, 
  markAllAsRead 
} from "../controllers/notificationController.js";
import { verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyAdmin); // All notification routes require admin

router.get("/", getNotifications);
router.put("/read-all", markAllAsRead);
router.put("/:id/read", markAsRead);

export default router;
