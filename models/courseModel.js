const { Sequelize, DataTypes } = require('sequelize');

class Course extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
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
          type: DataTypes.STRING,
          primaryKey: true,
          allowNull: false,
          unique: true,
          // Auto-generate courseCode as an auto-incremented field
          defaultValue: Sequelize.fn('uuid_generate_v4'),
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
  }

  static associate(models) {
    // Define associations here if needed
    // For example: Course.belongsToMany(models.Student, { through: 'Enrollment' });

    // Eahc course can be enrolled many times 
    this.hasMany(models.Enrollment, {
        foreignKey: 'courseId',
        as: 'enrollments',
    });
    
  }
}

module.exports = Course;
