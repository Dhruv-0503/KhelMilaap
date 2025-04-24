const coachControl = require("../Controllers/coachControl");
const router = require('express').Router();
const authMiddleware = require("../Middleware/authMiddleware");

router.get('/getlist', coachControl.getCoaches);
router.post('/hire',authMiddleware, coachControl.hireCoach);


module.exports = router;