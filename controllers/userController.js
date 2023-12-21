const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

// This function filters out the unwanted fileds that aren't allowd to be updated 
const filterObj = (obj, ...allowedFields)=>{
    const newObj = {};
    Object.keys(obj).forEach(el=>{
        if(allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
}

// The user update his data 
exports.updateMe = catchAsync( async (req,res,next) =>{
    // 1 - create error if user POSTs password data 
    if(req.body.password || req.body.passwordConfirm){
        return next(new AppError('This route is not for password updates',400));
    }

    // 2 - filter out the unwanted fileds that aren't allowd to be updated 
    const filterdBody = filterObj(req.body,'name','email');

    // 3 - Update user document 
    const [affectedRowsCount, [updatedUser]] = await User.update(filteredBody, {
        where: {
            nationalId: req.user.nationalId,
        },
        returning: true, // Get the updated user as a result
    });
    
    if(affectedRowsCount > 0){
        res.status(200).json({
            status:'success',
            data:{
                updateedUser
            }
        });
    }else{
        return next(new AppError('No data is changed',400));
    }
      

});

// The User deletes his account 
exports.deleteMe = catchAsync(async (req,res,next)=>{
    await User.update(
        { active: false },
        {
          where: {
            nationalId: req.user.nationalId,
          },
        }
    );

    res.status(204).json({
        status:'success',
        data:null
    });
});

exports.getAllUsers= catchAsync(async (req, res, next) => {
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
    const students = await User.findAll(features.query);
    
    res.status(200).json({
      status: 'success',
      results: students.length,
      data: {
        students,
      },
    });
  });



// Admin or Staff search for a specific student 

exports.getUser = catchAsync(async (req, res, next) => {

  const { userId } = req.params; // Assuming the user ID is in the request parameters
  const user = await User.findByPk(userId);

  if (!user) {
    return next(new AppError('User not fount',404));
  }
  
  // Return the user data
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});


// The admin creates a user profile 
exports.createUser = catchAsync(async (req,res,next)=>{
    res.status(500).json({
        status : 'error',
        message : 'This route is not yet defined'
    });
});


// The admin updates some user data 
exports.updateUser = catchAsync(async (req,res,next)=>{
    res.status(500).json({
        status : 'error',
        message : 'This route is not yet defined'
    });
});


// The admin deletes some user 
exports.deleteUser = catchAsync(async (req,res,next)=>{
    res.status(500).json({
        status : 'error',
        message : 'This route is not yet defined'
    });
});