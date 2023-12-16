// grade.js

const { Sequelize, DataTypes } = require('sequelize');

class Grade extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        mid: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: false,
          validate: {
            isDecimal: true,
            min: { args: [0], msg: 'Midterm grade should be a minimum of 0.' },
            max: { args: [20], msg: 'Midterm grade should be a maximum of 20.' },
          },
        },
        final: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: false,
          validate: {
            isDecimal: true,
            min: { args: [0], msg: 'Final grade should be a minimum of 0.' },
            max: { args: [50], msg: 'Final grade should be a maximum of 50.' },
          },
        },
        project: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: false,
          validate: {
            isDecimal: true,
            min: { args: [0], msg: 'Project grade should be a minimum of 0.' },
            max: { args: [15], msg: 'Project grade should be a maximum of 15.' },
          },
        },
        coursework: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: false,
          validate: {
            isDecimal: true,
            min: { args: [0], msg: 'Coursework grade should be a minimum of 0.' },
            max: { args: [15], msg: 'Coursework grade should be a maximum of 15.' },
          },
        },
        issueDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        // Add other attributes specific to the Grade model, if needed
      },
      {
        sequelize,
        modelName: 'Grade',
      }
    );
  }

  static associate(models) {
    // each grade is issued to one enrollment 
    this.belongsTo(models.Enrollment, {
        foreignKey: 'enrollmentId',
        onDelete: 'CASCADE',
        as: 'enrollment',
      });
      // each grade is issued by one staff member
      this.belongsTo(models.User, {
        foreignKey: 'nationalId',
        onDelete: 'SET NULL',
        as: 'staff',
      });

  }
}

module.exports = Grade;
