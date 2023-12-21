const Enrollment = require('./../models/enrollmentModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');


// Get all the Enrollments 
exports.getAllEnrollments= catchAsync(async (req, res, next) => {
    const features = new APIFeatures(req.query);
    // // Additional conditions and attribute exclusions
    // features.query.where = {
    //     role: 'student',
    // };
    // features.query.attributes= {
    //     exclude: ['role'],
    // };
    //console.log(features.query);
    console.log(req.query);
    const enrollments = await Enrollment.findAll(features.query);
    
    res.status(200).json({
      status: 'success',
      results: enrollments.length,
      data: {
        enrollments,
      },
    });
});

// search for a specific enrollment 
exports.getEnrollment = catchAsync(async (req, res, next) => {

  const { id } = req.params; // Assuming the enrollment ID is in the request parameters
  const enrollment = await Enrollment.findByPk(id);

  if (!enrollment) {
    return next(new AppError('enrollment not fount',404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
        enrollment,
    },
  });
});

// The admin creates a enrollment 
exports.createEnrollment = catchAsync(async (req,res,next)=>{
    const newEnrollment = await Enrollment.create(req.body);
    if(!newEnrollment){
        return next(new AppError('Enrollment is not created, something went wrong',401));
    }

    res.status(201).json({
        status : 'success',
        newEnrollment
    });
});

// The admin updates some enrollment data 
exports.updateEnrollment = catchAsync(async (req,res,next)=>{
    const enrollmentId = req.params.id;
    const { firstName, lastName, email } = req.body;
    const enrollment = await Enrollment.findByPk(enrollmentId);
    if(!enrollment){
        return next(new AppError('Enrollment not fount',404));
    }
    
    const updatedEnrollment = await enrollment.update(req.body);

    res.status(200).json({
        status : 'succesful',
        updatedEnrollment
    });
});

// The admin deletes some enrollment 
exports.deleteEnrollment = catchAsync(async (req,res,next)=>{
    const enrollmentId = req.params.id;
    const enrollment = await Enrollment.findByPk(enrollmentId);
    if(!enrollment){
        return next(new AppError('Enrollment not fount',404));
    }
    
    await enrollment.destroy();

    res.status(200).json({
        status : 'succesful',
    });
});