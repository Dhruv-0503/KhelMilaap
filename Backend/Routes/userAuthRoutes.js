const express = require('express');
const userAuthControl = require('../Controllers/userAuthControl');

const router = express.Router();

router.post('/register', userAuthControl.registerUser);
router.post('/login', userAuthControl.loginUser);
router.post('/google-auth', userAuthControl.googleAuth);
router.post('/logout', userAuthControl.logoutUser);

module.exports = router;
