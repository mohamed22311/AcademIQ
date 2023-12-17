const {DataTypes,Sequelize} = require("sequelize");
const sequelize = require('../utils/database');

const Course = sequelize.define(
  'Course',
  {
    courseName: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        // Convert the first character to uppercase and the rest to lowercase
        this.setDataValue('courseName', value.charAt(0).toUpperCase() + value.slice(1).toLowerCase());
      },
    },
    courseCode: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      unique: true,
      autoIncrement: true,
      // Auto-generate courseCode as an auto-incremented field
      //defaultValue: Sequelize.fn('uuid_generate_v4'),
    },
    credits: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: { args: [0], msg: 'Credits should be a non-negative number.' },
      },
    },
    description: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    hooks: {
      // Add hooks or additional logic as needed
    },
  }
); 

Course.associate = (models)=> {
  // Define associations here if needed

  // Eahc course can be enrolled many times 
  Course.hasMany(models.Enrollment, {
      foreignKey: 'courseId',
      as: 'enrollments',
      targetKey: 'courseCode', // Explicitly set the target key
  });

};

module.exports = Course;
