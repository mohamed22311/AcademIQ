const {DataTypes,Sequelize} = require("sequelize");
const sequelize = require('../utils/database');

const Semester = sequelize.define(
  'Semester',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      //defaultValue: Sequelize.fn('uuid_generate_v4'), // Use uuid_generate_v4() function
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

Semester.associate = (models)=> {
  // Define associations here if needed

  // each semester has many enrollments 
  Semester.hasMany(models.Enrollment, {
      foreignKey: 'semesterId',
      as: 'enrollments',
    });

}

module.exports = Semester;
