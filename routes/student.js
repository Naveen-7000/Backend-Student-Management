const express = require('express');
const { getStudent,studentLogin } = require('../controller/student');
const { getAttendance } = require('../controller/attendance');
const router = express.Router();

// admin can create a new students account
router.post('/login',studentLogin);
router.get('/getme/:username',getStudent);
router.get('/attendance',getAttendance)

module.exports = router;