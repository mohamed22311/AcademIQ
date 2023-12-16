const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require("path");
const cookieParser = require("cookie-parser");

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');


//const tourRouter = require('./routes/tourRoutes');
//const userRouter = require('./routes/userRoutes');


const app = express();


// Global Middlewares

// Set secuirty HTTP headers 
app.use(helmet());

// Development logging
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

// Limit requests from same API 
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, tye later', 
});
app.use('/api',limiter);

// Body parser, reading data from the body into req.body and limit the data in the req.body to 10kb
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Data sanitization agains cross-site scripting attacks XSS 
app.use(xss());

// Prevent prameter pollution 
// app.use(hpp({
//     whitelist: ['duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price']
// }));

// Serving static files 
app.use(express.static(`${__dirname}/public`));

// Test middleware 
app.use((req,res,next)=>{
    req.requestTime = new Date().toISOString();
    console.log(req.cookies);
    next();
});

// // ROUTES
// app.use('/api/v1/tours',tourRouter);
// app.use('/api/v1/users',userRouter);
    
// Unhandled routes 
app.all('*', (req,res,next)=>{
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// handle errors 
app.use(globalErrorHandler);

module.exports = app;

