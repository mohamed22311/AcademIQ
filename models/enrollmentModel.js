const {DataTypes} = require("sequelize");
const sequelize = require('../utils/database');

const Enrollment = sequelize.define(
  'Enrollment',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Enrollment',
  }
); 

Enrollment.associate = (models)=> {
  // Each enrollment belongs to a user
  Enrollment.belongsTo(models.User, {
    foreignKey: 'nationalId', // Assuming this is the correct foreign key
    onDelete: 'CASCADE',
  });

  // Each enrollment belongs to a course
  Enrollment.belongsTo(models.Course, {
    foreignKey: 'courseId', // Assuming this is the correct foreign key
    onDelete: 'CASCADE',
  });

  // Each enrollment belongs to a semester
  Enrollment.belongsTo(models.Semester, {
    foreignKey: 'semesterId', // Assuming this is the correct foreign key
    onDelete: 'CASCADE',
  });

  // Each enrollment has one grade
  Enrollment.hasOne(models.Grade, {
    foreignKey: 'enrollmentId', // Assuming this is the correct foreign key
    as: 'grade',
  });
}

module.exports = Enrollment;
