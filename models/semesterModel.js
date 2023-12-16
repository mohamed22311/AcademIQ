const { Sequelize, DataTypes } = require('sequelize');

class Semester extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: Sequelize.fn('uuid_generate_v4'), // Use uuid_generate_v4() function
          allowNull: false,
        },
        year: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            min: { args: [1900], msg: 'Year should be 1900 or later.' },
          },
        },
        type: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            isIn: [['fall', 'spring', 'summer']],
          },
        },
        startDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        endDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
      {
        sequelize,
      }
    );
  }

  static associate(models) {
    // Define associations here if needed
    // For example: Semester.hasMany(models.Course);

    // each semester has many enrollments 
    this.hasMany(models.Enrollment, {
        foreignKey: 'semesterId',
        as: 'enrollments',
      });


  }
}

module.exports = Semester;
