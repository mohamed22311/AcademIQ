const express = require('express');
const authController = require('./../controllers/authController');
const semesterController = require('./../controllers/semesterController');

const router = express.Router();

router
    .route('/')
    .get(authController.protect,authController.restrictTo('admin'),semesterController.getAllSemesters)
    .post(authController.protect,authController.restrictTo('admin'),semesterController.createSemester);
router
    .route('/:id')
    .get(authController.protect,authController.restrictTo('admin','staff'),semesterController.getSemester)
    .patch(authController.protect,authController.restrictTo('admin'),semesterController.updateSemester)
    .delete(authController.protect,authController.restrictTo('admin'),semesterController.deleteSemester);

module.exports = router;