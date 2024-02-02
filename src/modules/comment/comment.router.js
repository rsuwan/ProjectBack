import { Router } from "express";
import * as postcontroller from "./comment.control.js";
const router = Router();

router.post(
  "/:community/:post/:id/createComment",
  postcontroller.createComment
);
router.delete(
  "/:community/:post/:id/deleteComment/:commentId",
  postcontroller.deleteComment
);
export default router;
