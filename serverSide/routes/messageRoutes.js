import express from "express";
 import auth from "../interceptors/auth.js";
import { getAllMessages, sendMessage } from "../api/messageApi.js";

const router = express.Router();

router.route('/send/:id').post(auth, sendMessage);
router.route('/all/:id').get(auth, getAllMessages);
 
export default router;