// const { Sequelize } = require('sequelize');

// class Database {
//   constructor() {
//     const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;
//     const connectionString = `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`;
//     this.sequelize = new Sequelize(connectionString);
//   }

//   async authenticate() {
//     try {
//       await this.sequelize.authenticate();
//       console.log('Connection has been established successfully.');
//     } catch (error) {
//       console.error('Unable to connect to the database:', error);
//     }
//   }

//   syncModels(...models) {
//     models.forEach((model) => {
//       model.init(this.sequelize);
//       if (model.associate) {
//         model.associate(this.sequelize.models);
//       }
//     });

//     // Synchronize models with the database (create tables if they don't exist)
//     this.sequelize.sync({ alter: true }); // Use { alter: true } for safe updates in development
//   }
// }

// module.exports = Database;

const Sequelize = require("sequelize");

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;
const connectionString = `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`;

const sequelize = new Sequelize('postgresql://mohamed22311:C38PIkdivfFc@ep-blue-sound-40202522.il-central-1.aws.neon.tech/academIQ?sslmode=require');
//const sequelize = new Sequelize(connectionString);

module.exports = sequelize;