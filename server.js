const dotenv = require('dotenv');

process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    process.exit(1);
  });


dotenv.config({ path: "./config.env" });
const app = require("./app");

// const database = new Database();

// // Correct order in the example
// const User = require('./models/userModel');
// const Enrollment = require('./models/enrollmentModel');
// const Grade = require('./models/gradeModel');
// const Course = require('./models/courseModel');
// const Semester = require('./models/semesterModel');

// async function startServer() {
//     await database.authenticate();
//     database.syncModels(User, Enrollment, Grade,Course,Semester);
// }
// startServer();

const sequelize = require("./utils/database");
const UserModel = require("./models/userModel");

sequelize
  .sync({ alter: true })
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