const {DataTypes} = require("sequelize");
const sequelize = require('../utils/database');

const SemesterRank = sequelize.define(
  'SemesterRank',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    rank:{
        type:DataTypes.INTEGER,
        allowNull:false,   
    },
    studentId: {
      type: DataTypes.INTEGER, // Change the data type based on your actual Semester model
      allowNull: false,
    },
    semesterId: {
      type: DataTypes.INTEGER, // Change the data type based on your actual Semester model
      allowNull: false,
    }
  },
  {
    sequelize,
    freezeTableName: true,
    modelName: 'SemesterRank',
  }
); 

SemesterRank.associate = (models)=> {
  // Each CourseStats belongs to a user
  SemesterRank.belongsTo(models.User, {
    foreignKey: 'studentId', // Assuming this is the correct foreign key
    onDelete: 'CASCADE',
  });

  // Each SemesterRank belongs to a semester
  SemesterRank.belongsTo(models.Semester, {
    foreignKey: 'semesterId', // Assuming this is the correct foreign key
    onDelete: 'CASCADE',
  });

}

module.exports = SemesterRank;
