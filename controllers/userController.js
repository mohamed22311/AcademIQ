const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

// This function filters out the unwanted fileds that aren't allowd to be updated 
const filterObj = (obj, ...allowedFields)=>{
    const newObj = {};
    Object.keys(obj).forEach(el=>{
        if(allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
}

// Return all active students 
exports.getAllStudents = catchAsync (async (req,res,next)=>{
    const students = await User.findAll({
        where: {
          role: 'student',
        },
        attributes: { exclude: ['role'] },
    });

    res.status(200).json({
        status:'success',
        results:students.length,
        data:{
            students
        }
    });
});


// Return All active staff members 
exports.getAllStaff = catchAsync (async (req,res,next)=>{
    const staffMembers = await User.findAll({
      where: {
        role: 'staff',
      },
      attributes: { exclude: ['role'] },
    });

    res.status(200).json({
        status:'success',
        results:staffMembers.length,
        data:{
            staffMembers
        }
    });
});

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

// Admin or Staff search for a specific student 
exports.getUser = catchAsync(async (req,res,next)=>{

    res.status(500).json({
        status : 'error',
        message : 'This route is not yet defined'
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