import express from "express";
import auth from '../interceptors/auth.js'
import upload from "../interceptors/multer.js";
import { 
            addDiscussion, createNewThought, bookmarkThought,
            deleteThought, unAppreciateThought, getAllThoughts, getDiscussionsOfThought, 
            getCarerThought, appreciateThought, reportThought
       } from "../api/thoughtApi.js";

const router = express.Router();

router.route("/addThought").post(auth, upload.single('image'), createNewThought);
router.route("/all").get(auth,getAllThoughts);
router.route("/carerPost/all").get(auth, getCarerThought);
router.route("/:id/appreciate").get(auth, appreciateThought);
router.route("/:id/unAppreciate").get(auth, unAppreciateThought);
router.route("/:id/discuss").post(auth, addDiscussion); 
router.route("/:id/discussions/all").post(auth, getDiscussionsOfThought);
router.route("/delete/:id").delete(auth, deleteThought);
router.route("/:id/bookmark").get(auth, bookmarkThought);
router.route("/:id/report").post(auth,reportThought);


export default router;
