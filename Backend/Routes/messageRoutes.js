/* const express = require('express');
const router = express.Router();
const chatController = require('../Controllers/messageControl');

router.post('/sendmsg', chatController.sendMessage);
router.get('/getmsg', chatController.getMessages);

module.exports = router;
 */

const express = require('express');
const router = express.Router();
const chatController = require('../Controllers/messageControl');

router.post('/sendmsg', chatController.sendMessage);
router.post('/getmsg', chatController.getMessages);
router.get('/user/:userId', chatController.getUserChats);

module.exports = router;
