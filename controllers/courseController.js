const Course = require('./../models/courseModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');


// Get all the courses 
exports.getAllCourses= catchAsync(async (req, res, next) => {
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
    const courses = await Course.findAll(features.query);
    
    res.status(200).json({
      status: 'success',
      results: courses.length,
      data: {
        courses,
      },
    });
});

// search for a specific course 
exports.getCourse = catchAsync(async (req, res, next) => {

  const { id } = req.params; // Assuming the course ID is in the request parameters
  const course = await Course.findByPk(id);

  if (!course) {
    return next(new AppError('course not fount',404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
        course,
    },
  });
});

// The admin creates a course 
exports.createCourse = catchAsync(async (req,res,next)=>{
    const newCourse = await Course.create(req.body);
    if(!newCourse){
        return next(new AppError('Course is not created, something went wrong',401));
    }

    res.status(201).json({
        status : 'success',
        newCourse
    });
});

// The admin updates some course data 
exports.updateCourse = catchAsync(async (req,res,next)=>{
    const courseId = req.params.id;
    //const { firstName, lastName, email } = req.body;
    const course = await Course.findByPk(courseId);
    if(!course){
        return next(new AppError('Course not fount',404));
    }
    
    const updatedCourse = await course.update(req.body);

    res.status(200).json({
        status : 'succesful',
        updatedCourse
    });
});

// The admin deletes some course 
exports.deleteCourse = catchAsync(async (req,res,next)=>{
    const courseId = req.params.id;
    const course = await Course.findByPk(courseId);
    if(!course){
        return next(new AppError('Course not fount',404));
    }
    
    await course.destroy();

    res.status(200).json({
        status : 'succesful',
    });
});