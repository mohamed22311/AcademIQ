const {DataTypes} = require("sequelize");
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sequelize = require('../utils/database');

const User = sequelize.define(
  'User',
  {
    nationalId: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      validate: {
        len: [14, 14],
        is: /^\d+$/, // Ensure it contains only digits
        isValidFirstDigit(value) {
          // Check if the first character is '2' or '3'
          if (value.charAt(0) !== '2' && value.charAt(0) !== '3') {
            throw new Error('First digit of nationalId must be 2 or 3.');
          }
        },
      },
    },  
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        // Convert the first character to uppercase and the rest to lowercase
        this.setDataValue('firstName', value.charAt(0).toUpperCase() + value.slice(1).toLowerCase());
      },
    },
    secondName: {
      type: DataTypes.STRING,
      set(value) {
        // Convert the first character to uppercase and the rest to lowercase
        this.setDataValue('secondName', value.charAt(0).toUpperCase() + value.slice(1).toLowerCase());
      },
    },
    thirdName: {
      type: DataTypes.STRING,
      set(value) {
        // Convert the first character to uppercase and the rest to lowercase
        this.setDataValue('thirdName', value.charAt(0).toUpperCase() + value.slice(1).toLowerCase());
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        // Convert the first character to uppercase and the rest to lowercase
        this.setDataValue('lastName', value.charAt(0).toUpperCase() + value.slice(1).toLowerCase());
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: 'Please provide a valid email' },
      },
      set(value) {
        this.setDataValue('email', value.toLowerCase());
      },
    },     
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^(010|011|012|015)\d{8}$/,
      },
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['admin', 'student', 'staff']],
      },
      defaultValue:'student'
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: { args: [12, Infinity], msg: 'Password must be at least 12 characters long' },
        // isStrongPassword(value) {
        //   const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
        //   if (!regex.test(value)) {
        //     throw new Error(
        //       'Password must contain at least 12 characters, including one uppercase letter, one lowercase letter, one number, and one special character.'
        //     );
        //   }
        // },
      },
    },
    passwordConfirm: {
      type: DataTypes.VIRTUAL,
      allowNull: false,
      validate: {
        async isPasswordMatch(value) {
          //if(!(await bcrypt.compare(value, this.password))) throw new Error('Passwords do not match');
          if (value !== this.password) {
            throw new Error('Passwords do not match');
          }
        },
      },
    },
    passwordChangedAt: DataTypes.DATE,
    passwordResetToken: DataTypes.STRING,
    passwordResetExpires: DataTypes.DATE,
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    birthdate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    currentYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: { args: [1], msg: 'Current year should be 1 or greater.' },
      },
    },
  },
  {
    defaultScope: {
      where: {
        active: true,
      },
    },
    hooks: {
      beforeSave: async (user, options) => {
        if (user.changed('password')) {
          if (user.password.length < 12) {
            throw new Error('Password must be at least 12 characters long');
          }
          const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
          if (!regex.test(user.password)) {
            throw new Error(
              'Password must contain at least 12 characters, including one uppercase letter, one lowercase letter, one number, and one special character.'
            );
          }

          user.passwordChangedAt = new Date() - 1000;
          user.password = bcrypt.hashSync(user.password, 12);
        }
      },
    },
  }
);

User.associate = (models) => {
  // Each student can make many enrollments
  User.hasMany(models.Enrollment, {
    foreignKey: 'nationalId',
    as: 'enrollments',
    targetKey: 'nationalId', // Explicitly set the target key
  });

  // Each staff member can issue a grade for an enrollment
  User.hasOne(models.Grade, {
    foreignKey: 'nationalId',
    as: 'grade',
  });
};

User.prototype.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

User.prototype.changedPasswordAfter = function (JTWTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JTWTimestamp < changedTimestamp;
  }
  return false;
};

User.prototype.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

module.exports = User;
