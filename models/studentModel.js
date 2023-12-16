// const { Sequelize, DataTypes } = require('sequelize');

// // Assuming you have a User model already defined
// const User = require('./user'); 

// class Student extends User {
//   static init(sequelize) {
//     return super.init(
//       {
//         nationalId: {
//             type: DataTypes.STRING,
//             primaryKey: true,
//             allowNull: false,
//             unique: true,
//             validate: {
//               is: /^[0-9]{14}$/, // Assumes nationalId is a 14-digit number
//             },
//           },
        
//       },
//       {
//         sequelize,
//         modelName: 'Student', // Set the model name explicitly
//       }
//     );
//   }

//   // Additional logic or hooks specific to the Student model can be added here

//   static associate(models) {
//     // each student is a user
//     this.belongsTo(models.User, {
//         foreignKey: 'nationalId', // Use nationalId as the foreign key
//         as: 'user', // Alias for the association
//       });

    

//   }

// }

// module.exports = Student;
