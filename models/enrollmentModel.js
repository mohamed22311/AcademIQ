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
    // Each enrollment belongs to a user
    this.belongsTo(models.User, {
      foreignKey: 'nationalId', // Assuming this is the correct foreign key
      onDelete: 'CASCADE',
    });

    // Each enrollment belongs to a course
    this.belongsTo(models.Course, {
      foreignKey: 'courseId', // Assuming this is the correct foreign key
      onDelete: 'CASCADE',
    });

    // Each enrollment belongs to a semester
    this.belongsTo(models.Semester, {
      foreignKey: 'semesterId', // Assuming this is the correct foreign key
      onDelete: 'CASCADE',
    });

    // Each enrollment has one grade
    this.hasOne(models.Grade, {
      foreignKey: 'enrollmentId', // Assuming this is the correct foreign key
      as: 'grade',
    });
  }
}

module.exports = Enrollment;
