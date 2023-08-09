const express = require('express');
const { adminData, adminLogin } = require('../controller/admin1');
const authorisedUser = require('../middlware/authorisedUser');
const {markAttendance} = require('../controller/attendance');
const {createStudent,getAllStudents} = require('../controller/student');

const router = express.Router();

router.post('/login',adminLogin);
router.get('/getme/:username',adminData);
router.post('/createstudent',authorisedUser,createStudent);
router.post('/mark-attendance',authorisedUser,markAttendance);
router.get('/students',authorisedUser,getAllStudents);
module.exports = router;