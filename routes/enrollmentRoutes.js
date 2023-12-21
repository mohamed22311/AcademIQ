const express = require('express');
const authController = require('./../controllers/authController');
const enrollmentController = require('./../controllers/enrollmentController');

const router = express.Router();

router
    .route('/')
    .get(authController.protect,authController.restrictTo('admin'),enrollmentController.getAllEnrollments)
    .post(authController.protect,authController.restrictTo('admin'),enrollmentController.createEnrollment);
router
    .route('/:id')
    .get(authController.protect,authController.restrictTo('admin','staff'),enrollmentController.getEnrollment)
    .patch(authController.protect,authController.restrictTo('admin'),enrollmentController.updateEnrollment)
    .delete(authController.protect,authController.restrictTo('admin'),enrollmentController.deleteEnrollment);

module.exports = router;