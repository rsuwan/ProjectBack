import { Router } from "express";
import * as messagesController from "./message.control.js";
const router = Router();

const messagesController = require("../controllers/messagesController");
router.post("/messages", messagesController.createMessage);
router.get("/posts/:postId/messages", messagesController.getPostMessages);

export default router;
