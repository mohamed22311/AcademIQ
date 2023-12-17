const {DataTypes} = require("sequelize");
const sequelize = require('../utils/database');

const Grade = sequelize.define(
  'Grade',
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
  },
  {
    sequelize,
    modelName: 'Grade',
  }
); 

Grade.associate = (models)=> {
  // each grade is issued to one enrollment 
  thGradeis.belongsTo(models.Enrollment, {
    foreignKey: 'enrollmentId',
    onDelete: 'CASCADE',
    as: 'enrollment',
  });
  // each grade is issued by one staff member
  Grade.belongsTo(models.User, {
    foreignKey: 'nationalId',
    onDelete: 'SET NULL',
    as: 'staff',
  });

}


module.exports = Grade;
