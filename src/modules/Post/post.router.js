import { Router } from "express";
import * as postcontroller from "./post.controller.js";
import fileUpload, { fileValidation } from "../../services/multer.js";
const router = Router();

router.get("/:community/postView", postcontroller.postView);
router.post("/:community/:id/createPost", postcontroller.createPosts);
router.get("/:community/viewPosts", postcontroller.viewPost);
router.delete("/:community/:id/deletePost/:postId", postcontroller.deletePost);
router.post(
  "/:id",
  fileUpload(fileValidation.image).fields([
    {name:'Images',maxCount:10},
    ]),
  postcontroller.addPostImage
);



export default router;
