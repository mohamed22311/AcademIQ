const Semester = require('./../models/semesterModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');


// Get all the Semesters 
exports.getAllSemesters= catchAsync(async (req, res, next) => {
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
    const semesters = await Semester.findAll(features.query);
    
    res.status(200).json({
      status: 'success',
      results: semesters.length,
      data: {
        semesters,
      },
    });
});

// search for a specific semester 
exports.getSemester = catchAsync(async (req, res, next) => {

  const { id } = req.params; // Assuming the semester ID is in the request parameters
  const semester = await Semester.findByPk(id);

  if (!semester) {
    return next(new AppError('semester not fount',404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
        semester,
    },
  });
});

// The admin creates a semester 
exports.createSemester = catchAsync(async (req,res,next)=>{
    const newSemester = await Semester.create(req.body);
    if(!newSemester){
        return next(new AppError('Semester is not created, something went wrong',401));
    }

    res.status(201).json({
        status : 'success',
        newSemester
    });
});

// The admin updates some semester data 
exports.updateSemester = catchAsync(async (req,res,next)=>{
    const semesterId = req.params.id;
    const { firstName, lastName, email } = req.body;
    const semester = await Semester.findByPk(semesterId);
    if(!semester){
        return next(new AppError('Semester not fount',404));
    }
    
    const updatedSemester = await semester.update(req.body);

    res.status(200).json({
        status : 'succesful',
        updatedSemester
    });
});

// The admin deletes some semester 
exports.deleteSemester = catchAsync(async (req,res,next)=>{
    const semesterId = req.params.id;
    const semester = await Semester.findByPk(semesterId);
    if(!semester){
        return next(new AppError('Semester not fount',404));
    }
    
    await semester.destroy();

    res.status(200).json({
        status : 'succesful',
    });
});