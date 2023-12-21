const crypto = require('crypto');
const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');
const Sequelize = require("sequelize");

const signToken = id=>{
    return jwt.sign( {id}, process.env.JWT_SECRET, {
        expiresIn:process.env.JWT_EXPIERS_IN
    });
};

const createSendToken = (user, statusCode, res) => {
    if (!user) {
        return res.status(500).json({
            status: 'error',
            message: 'User is undefined',
        });
    }

    const token = signToken(user.nationalId);
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);

    // Remove the password from the output
    // Check if user.password exists before setting it to undefined
    user.password = undefined;
    user.passwordConfirm = undefined;
    user.active= undefined;
    user.updatedAt= undefined;
    user.createdAt= undefined;
    user.passwordChangedAt= undefined;
    user.passwordResetToken= undefined;
    user.passwordResetExpires= undefined;
    if(!user.birthdate) user.birthdate = undefined;
    if(!user.department) user.department = undefined;
    if(!user.currentYear) user.currentYear = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user,
        },
    });
};

exports.signup = catchAsync( async(req,res,next)=>{
    const newUser = await User.create({
        nationalId: req.body.nationalId,
        firstName: req.body.firstName,
        secondName:req.body.secondName,
        thirdName:req.body.thirdName,
        lastName: req.body.lastName,
        email:req.body.email,
        phone: req.body.phone,
        role:req.body.role,
        password:req.body.password,
        passwordConfirm:req.body.passwordConfirm,
        
    });

    createSendToken(newUser,201,res);
});

exports.login = catchAsync( async (req,res,next)=>{
    const {email,password} = req.body;

    // 1 - check if email and password exist 
    if(!email || !password){
        return next(new AppError('Please provide email and password', 400));
    }
    // 2 - check if user exits and password correct 
    const user = await User.findOne({
        where: { email },
        attributes: { include: ['password'] },
    });

    if(!user || (!await user.correctPassword(password,user.password)) ){
        return next(new AppError('Incorrect email or password',401));
    }
    // 3 - if everything is ok, send token to the client 
    createSendToken(user,200,res);
});

exports.protect = catchAsync( async (req,res,next) => {
    // 1 - get the token and check if it exits
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    if(!token){
        return next(new AppError('You are not logged in! Please log in to get access.',401)); // 401 unauthroized
    }
    // 2 - verfiy the token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // 3 - check if user still exits
    const currentUser = await User.findByPk(decoded.id);
    if(!currentUser){
        return next(new AppError('The user beloging to this token does no longer exist.',401));
    }
    // 4 - check if user changed password after the token was issued 
    if(currentUser.changedPasswordAfter(decoded.iat)){
        return next(new AppError('User recently changed password! Please log in again.',401));
    }
    req.user = currentUser;
    next();
});

exports.restrictTo = (...roles) =>{ // we can't add arguments to a middleware so we make function that wraps a function
    return (req,res,next) =>{
        if(!roles.includes(req.user.role)){
            return next(new AppError('You do not have permission!', 403)); // 403 forbidden
        }
        next();
    };
};

exports.forgotPassword = catchAsync( async (req,res,next) =>{
    // 1 - get user based on posted email
    const user = await User.findOne({ where: { email: req.body.email } });
    if(!user){
        return next(new AppError('There is no user with that email address.',404));
    }
    // 2 - Generate the random reset token 
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    // 3 - send the token to the user email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with the new password and passwordConfirm to ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    try{
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 minutes only)',
            message,
        });
    
        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!',
        });

    }catch(err){
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new AppError('There is an error sending the email. tye again later',500));
    }

});

exports.resetPassword = catchAsync( async (req,res,next) =>{
    // 1 - get user based on token 
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex'); // we don't use findOneandUpdate because it won't run the middlewares so we use find then save
    const user = await User.findOne({
        where: {
          passwordResetToken: hashedToken,
          passwordResetExpires: {
            [Sequelize.Op.gt]: Date.now(),
          },
        },
      });

    // 2 - if token isn't expired and there's a user, set new password
    if(!user){
        return next(new AppError('Token is Invalid or has Expired',400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 3 - update changedPasswordAt proprty for the user

    // 4 - log the user in, send JWT
    createSendToken(user,200,res);
});

exports.updatePassword = catchAsync( async (req,res,next) => {
    // 1 - get user from collection 
    const user = await User.findByPk(req.user.nationalId, { attributes: { include: ['password'] } });
    
    // 2 - check if current password is correct 
    if(!(await user.correctPassword(req.body.passwordCurrent, user.password))){
        return next(new AppError('Wrong password!',401));
    }

    // 3 - if so, update the password 
    if (!req.body.password || !req.body.passwordConfirm) {
        return next(new AppError('Please provide both password and password confirmation', 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    // 4 - log the user in, send jwt
    createSendToken(user,200,res);
});