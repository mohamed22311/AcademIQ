// // staff.js

// const { Sequelize, DataTypes } = require('sequelize');

// class Staff extends Sequelize.Model {
//   static init(sequelize) {
//     return super.init(
//       {
//         nationalId: {
//           type: DataTypes.STRING,
//           primaryKey: true,
//           allowNull: false,
//           unique: true,
//           validate: {
//             is: /^[0-9]{14}$/, // Assumes nationalId is a 14-digit number
//           },
//         },
//         department: {
//           type: DataTypes.STRING,
//           allowNull: false,
//         },
//         role: {
//           type: DataTypes.STRING,
//           allowNull: false,
//           validate: {
//             isIn: [['admin', 'instructor', 'support_staff']],
//           },
//         },
//         // Add other attributes specific to the Staff model
//         // For example: email, name, etc.
//       },
//       {
//         sequelize,
//         modelName: 'Staff',
//       }
//     );
//   }

//   static associate(models) {
//     // each staff member is a user 
//     this.belongsTo(models.User, {
//       foreignKey: 'nationalId',
//       as: 'user',
//     });

//     // each staff member can issue a grade for an enrollment 
//     this.hasOne(models.Grade, {
//         foreignKey: 'staffId',
//         as: 'grade',
//       });
      
//   }
// }

// module.exports = Staff;
