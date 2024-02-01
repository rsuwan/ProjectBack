import { Router } from "express";
import * as postcontroller from "./post.controller.js";
import fileUpload, { fileValidation } from "../../services/multer.js";
const router = Router();

router.get("/:community/postView", postcontroller.postView);
router.post("/:community/:id/createPost", postcontroller.createPosts);
router.get("/:community/viewPosts", postcontroller.viewPost);
router.delete("/:community/:id/deletePost/:postId", postcontroller.deletePost);
// router.put('/editPost',postcontroller.updatePost);
// router.post("/:community/:id/addImages", fileUpload(fileValidation.image).fields([

//     {name:'Images',maxCount:30},
//       ]),postcontroller.addImages);
// router.post("/createCommunitys", fileUpload(fileValidation.image).fields([
// {name:'mainImage',maxCount:1},
// {name:'supImages',maxCount:30},
// ]),communityscntroller.createCommunitys);
router.post(
  "/:id",
  fileUpload(fileValidation.image).fields([
    {name:'Images',maxCount:10},
    ]),
  postcontroller.addPostImage
);


// router.post("/:community/likePost", postcontroller.likePost);

export default router;
