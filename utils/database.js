const { Sequelize } = require('sequelize');



// const Sequelize = require("sequelize");

// const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;
// const connectionString = `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`;

// const sequelize = new Sequelize(connectionString);

// module.exports = sequelize;


class Database {
  constructor() {
    // this.sequelize = new Sequelize('database', 'username', 'password', {
    //   host: 'postgresql://theyaseenashraf:YpsW2dLK5qCu@ep-wandering-art-35443282-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require',
    //   //dialect: 'postgres', // Adjust this based on your database system
    // });
    this.sequelize = new Sequelize('postgresql://theyaseenashraf:YpsW2dLK5qCu@ep-wandering-art-35443282-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require');
  }

  async authenticate() {
    try {
      await this.sequelize.authenticate();
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  }

  syncModels(...models) {
    models.forEach((model) => {
      model.init(this.sequelize);
      if (model.associate) {
        model.associate(this.sequelize.models);
      }
    });

    // Synchronize models with the database (create tables if they don't exist)
    this.sequelize.sync();
  }
}

module.exports = Database;