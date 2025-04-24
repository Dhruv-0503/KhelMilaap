/* const express = require('express');
const router = express.Router();
const communityControl = require('../Controllers/communityControl');
const authMiddleware = require('../Middleware/authMiddleware');


router.post('/community/create', authMiddleware, communityControl.createCommunity);
router.post('/community/join', communityControl.joinCommunity);
router.post('/community/sendmsg', communityControl.sendMessage);
router.post('/community/leave', communityControl.leaveCommunity);

router.get('/community/:communityId/messages', communityControl.getCommunityMessages);
router.get('/community/:communityId', communityControl.getCommunityDetails);

router.put('/community/:communityId', authMiddleware,  communityControl.updateCommunity);

router.delete('/community/:communityId', authMiddleware,  communityControl.deleteCommunity);

module.exports = router;
 */

const express = require('express');
const router = express.Router();
const communityControl = require('../Controllers/communityControl');
const authMiddleware = require('../Middleware/authMiddleware');

// Community Creation and Joining
router.post('/create', authMiddleware, communityControl.createCommunity);
router.post('/join', authMiddleware, communityControl.joinCommunity);
router.post('/leave', authMiddleware, communityControl.leaveCommunity);

// Community Details and Messages
router.get('/:communityId', communityControl.getCommunityDetails);

// Community Update and Delete
//router.put('/community/:communityId', authMiddleware, communityControl.updateCommunity);
router.delete('/:communityId', authMiddleware, communityControl.deleteCommunity);

module.exports = router;
