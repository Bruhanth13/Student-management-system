const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.get('/:branch', studentController.getAllStudents);
router.get('/:branch/:roll_no', studentController.getStudentByRollNo);
router.post('/:branch', studentController.addStudent);
router.put('/:branch/:roll_no', studentController.updateStudent);
router.delete('/:branch/:roll_no', studentController.deleteStudent);

module.exports = router;