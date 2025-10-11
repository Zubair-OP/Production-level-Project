import { Router } from 'express';
import { loginUser, registerUser, logoutUser, ChangeUserPassword,getcurrentUser, UpdateProfile } from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyUser } from '../middlewares/auth.middleware.js';
import { RefreshAccessToken } from '../controllers/user.controller.js';

const router = Router();

router.route('/register').post(
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 },
  ]),
  registerUser
);

router.route('/login').post(loginUser);

router.route('/logout').post(verifyUser, logoutUser);

router.route('/refresh-token').post(RefreshAccessToken);

router.route('/changePassword').post(verifyUser,ChangeUserPassword);

router.route('/getcurrentUser').get(verifyUser,getcurrentUser);

router.route('/UpdateProfile').patch(verifyUser,UpdateProfile);

router.route('/UpdateAvatar').patch(verifyUser,upload.single('avatar'),UpdateProfile);

router.route('/UpdateCoverImage').patch(verifyUser,upload.single('coverImage'),UpdateCoverImage);

router.route('/c/:username').get(verifyUser,getUserProfileDetails);

router.route('/history').get(verifyUser,getWatchHistory);

export default router;
