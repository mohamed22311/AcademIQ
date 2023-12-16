// enrollment.js

const { Sequelize, DataTypes } = require('sequelize');

class Enrollment extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        // Add other attributes specific to the Enrollment model, if needed
        
      },
      {
        sequelize,
        modelName: 'Enrollment',
      }
    );
  }

  static associate(models) {
    // each student has many enrollments 
    this.belongsTo(models.User, {
      foreignKey: 'nationalId',
      onDelete: 'CASCADE',
    });
    // each course is enrolled many times
    this.belongsTo(models.Course, {
      foreignKey: 'courseId',
      onDelete: 'CASCADE',
    });
    // each semster has many enrollments 
    this.belongsTo(models.Semester, {
      foreignKey: 'semesterId',
      onDelete: 'CASCADE',
    });
    // each enrollment has one grade 
    this.hasOne(models.Grade, {
        foreignKey: 'enrollmentId',
        as: 'grade',
      });
  }
}

module.exports = Enrollment;
