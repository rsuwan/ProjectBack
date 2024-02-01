import { Router } from "express";
import fileUpload, { fileValidation } from "../../services/multer.js";
import * as UsersController from "./user.controller.js";
const router = Router();

router.get("/:email/viewMyPosts", UsersController.viewMyPosts);

router.get("/:email/viewMyComments", UsersController.viewMyComments);

router.get(
  "/:email/viewMyPersonalInformation",
  UsersController.viewMyPersonalInformation
);

router.post("/:email/changePassword", UsersController.changePassword);
router.post(
  "/:email/updateMyPersonalInformation",
  UsersController.updateMyPersonalInformation
);

router.post(
  "/addimage/:email",
  fileUpload(fileValidation.image).single("image"),
  UsersController.addImageAdmin
);

router.post(
  "/:email",
  fileUpload(fileValidation.image).single("image"),
  UsersController.addImageUser
);

router.put(
  "/:email",
  fileUpload(fileValidation.image).single("image"),
  UsersController.updateImageUser
);
router.put(
  "/uopdateimage/:email",
  fileUpload(fileValidation.image).single("image"),
  UsersController.updateImageAdmin
);

router.delete('/:email', UsersController.deleteImageUser);
router.delete('/:email/deleteImage', UsersController.deleteImageAdmin);

// router.post('/:id/like', UsersController.likePost);
// router.post('/:id/unlike', UsersController.unlikePost);

export default router;
