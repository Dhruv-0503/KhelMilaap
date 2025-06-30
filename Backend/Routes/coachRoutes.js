const coachControl = require("../Controllers/coachControl");
const router = require('express').Router();
const authMiddleware = require("../Middleware/authMiddleware");

router.get('/getCoaches', coachControl.getCoaches);
router.post('/hireCoach',authMiddleware, coachControl.hireCoach);


module.exports = router;