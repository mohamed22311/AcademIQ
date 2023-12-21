const dotenv = require('dotenv');

process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    process.exit(1);
  });


dotenv.config({ path: "./config.env" });
const app = require("./app");

const sequelize = require("./utils/database");
const UserModel = require("./models/userModel");
const CourseModel = require('./models/courseModel');
const SemesterModel = require('./models/semesterModel');
const EnrollmentModel = require('./models/enrollmentModel');
const GradeModel = require('./models/gradeModel');
const CourseStatsModel = require('./models/courseStatisticsModel');
const SemesterRankModel = require('./models/semesterRankModel');
sequelize
  .sync(
    { alter: true }
  )
  .then((results) => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log(err);
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, ()=>{
    console.log(`App running on port ${port}....`);
});


process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});