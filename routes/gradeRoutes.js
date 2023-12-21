const express = require('express');
const authController = require('./../controllers/authController');
const gradeController = require('./../controllers/gradeController');

const router = express.Router();

router
    .route('/')
    .get(authController.protect,authController.restrictTo('admin','staff'),gradeController.getAllGrades)
    .post(authController.protect,authController.restrictTo('staff'),gradeController.createGrade);
router
    .route('/:id')
    .get(authController.protect,gradeController.getGrade)
    .patch(authController.protect,authController.restrictTo('staff'),gradeController.updateGrade)
    .delete(authController.protect,authController.restrictTo('admin','staff'),gradeController.deleteGrade);

module.exports = router;