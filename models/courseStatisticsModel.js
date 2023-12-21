const {DataTypes} = require("sequelize");
const sequelize = require('../utils/database');

const CourseStats = sequelize.define(
  'CourseStats',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    lower_range:{
        type:DataTypes.INTEGER,
        allowNull:false,
        validate: {
            isDecimal: true,
            min: { args: [0], msg: 'Lower Range should be a minimum of 0.' },
            max: { args: [100], msg: 'Lower Range should be a maximum of 100.' },
          },
    },
    upper_range:{
        type:DataTypes.INTEGER,
        allowNull:false,
        validate: {
            isDecimal: true,
            min: { args: [0], msg: 'Upper Range should be a minimum of 0.' },
            max: { args: [100], msg: 'Upper Range should be a maximum of 100.' },
          },
    },
    count:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    semesterId: {
      type: DataTypes.INTEGER, // Change the data type based on your actual Semester model
      allowNull: false,
    },
    courseId: {
      type: DataTypes.INTEGER, // Change the data type based on your actual Semester model
      allowNull: false,
    }
  },
  {
    sequelize,
    freezeTableName: true,
    modelName: 'CourseStats',
  }
); 

CourseStats.associate = (models)=> {

  // Each CourseStats belongs to a course
  CourseStats.belongsTo(models.Course, {
    foreignKey: 'courseId', // Assuming this is the correct foreign key
    onDelete: 'CASCADE',
  });

  // Each courseStats belongs to a semester
  CourseStats.belongsTo(models.Semester, {
    foreignKey: 'semesterId', // Assuming this is the correct foreign key
    onDelete: 'CASCADE',
  });


}

module.exports = CourseStats;
