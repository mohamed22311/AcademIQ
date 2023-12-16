const dotenv = require('dotenv');

process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    process.exit(1);
  });


dotenv.config({ path: "./config.env" });
const app = require("./app");

const UserModel = require('./models/userModel');
const courseModel = require('./models/courseModel');
const EnrollmentModel = require('./models/enrollmentModel');
const semesterModel = require('./models/semesterModel');
const GradeModel = require('./models/gradeModel');


const Database = require('./utils/database');

const database = new Database();
async function startServer() {
    await database.authenticate();
    database.syncModels(UserModel, EnrollmentModel, GradeModel,courseModel,semesterModel);
}
startServer();


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