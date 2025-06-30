const express = require('express');
const router = express.Router();
const profileControl = require('../Controllers/profileControl');
const authMiddleware = require('../Middleware/authMiddleware');
const upload = require('../Middleware/multer');

router.get('/profile/searchPlayer', profileControl.searchPlayers);

router.route('/profile/:id')
    .get(profileControl.getProfile)
    .put(authMiddleware, profileControl.updateProfile)
    .delete(authMiddleware, profileControl.deleteProfile);
  
router.post(
    '/upload-image',
    authMiddleware,
    upload.single('image'),
    profileControl.uploadProfileImage
);

router.put('/profile/deletePost/:userId', authMiddleware, profileControl.deletePost);

router.get('/profile/:id/followers', profileControl.getFollowers);
router.get('/profile/:id/following', profileControl.getFollowing);
router.post('/profile/connect', authMiddleware, profileControl.buildConnection);


module.exports = router;

