const express = require('express');
const router = express.Router();
const authorisedUser = require('../middlware/authorisedUser');
const markAttendance = require('../controller/attendance');

router.post('/mark-attendance',authorisedUser,markAttendance);

module.exports = router;