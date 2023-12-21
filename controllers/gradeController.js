const Grade = require('./../models/gradeModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');


// Get all the Grades 
exports.getAllGrades= catchAsync(async (req, res, next) => {
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
    const grades = await Grade.findAll(features.query);
    
    res.status(200).json({
      status: 'success',
      results: grades.length,
      data: {
        grades,
      },
    });
});

// search for a specific grade 
exports.getGrade = catchAsync(async (req, res, next) => {

  const { id } = req.params; // Assuming the grade ID is in the request parameters
  const grade = await Grade.findByPk(id);

  if (!grade) {
    return next(new AppError('grade not fount',404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
        grade,
    },
  });
});

// The admin creates a grade 
exports.createGrade = catchAsync(async (req,res,next)=>{
    const newGrade = await Grade.create(req.body);
    if(!newGrade){
        return next(new AppError('Grade is not created, something went wrong',401));
    }

    res.status(201).json({
        status : 'success',
        newGrade
    });
});

// The admin updates some grade data 
exports.updateGrade = catchAsync(async (req,res,next)=>{
    const gradeId = req.params.id;
    const { firstName, lastName, email } = req.body;
    const grade = await Grade.findByPk(gradeId);
    if(!grade){
        return next(new AppError('Grade not fount',404));
    }
    
    const updatedGrade = await grade.update(req.body);

    res.status(200).json({
        status : 'succesful',
        updatedGrade
    });
});

// The admin deletes some grade 
exports.deleteGrade = catchAsync(async (req,res,next)=>{
    const gradeId = req.params.id;
    const grade = await Grade.findByPk(gradeId);
    if(!grade){
        return next(new AppError('Grade not fount',404));
    }
    
    await grade.destroy();

    res.status(200).json({
        status : 'succesful',
    });
});