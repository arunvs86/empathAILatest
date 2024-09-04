import express from "express";
import { editProfile, careOrBeTakenCareOf, getProfile, findUsers, signIn, signOut, signup } from "../api/carerApi.js";
import auth from '../interceptors/auth.js'
import upload from "../interceptors/multer.js";

const router = express.Router();

router.route('/signup').post(signup);
router.route('/signin').post(signIn);
router.route('/signout').get(signOut);
router.route('/:id/profile').get(auth, getProfile);
router.route('/profile/edit').post(auth, upload.single('userDp'), editProfile);
router.route('/find').get(auth, findUsers);
router.route('/toggleCare').post(auth,careOrBeTakenCareOf);

export default router;