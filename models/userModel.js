const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

class User extends Sequelize.Model{

  static init(sequelize) {
    return super.init(
      {
        nationalId: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
            validate: {
              isNumeric: true,
              len: [14, 14],
            },
            set(value) {
              const century = value.charAt(0) === '2' ? '19' : '20';
              const year = century + value.substr(1, 2);
              const month = value.substr(3, 2);
              const day = value.substr(5, 2);
  
              this.setDataValue('birthdate', new Date(`${year}-${month}-${day}`));
            },
        },
        firstName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        secondName: {
          type: DataTypes.STRING,
        },
        thirdName: {
          type: DataTypes.STRING,
        },
        lastName: {
          type: DataTypes.STRING,
          allowNull: false,
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
            isStrongPassword(value) {
              // Custom validation for a strong password
              const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
              if (!regex.test(value)) {
                throw new Error(
                  'Password must contain at least 12 characters, including one uppercase letter, one lowercase letter, one number, and one special character.'
                );
              }
            },
          },
          set(value) {
            const hashedPassword = bcrypt.hashSync(value, 12);
            this.setDataValue('password', hashedPassword);
          },
        },
        passwordConfirm: {
          type: DataTypes.VIRTUAL,
          allowNull: false,
          validate: {
            isPasswordMatch(value) {
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
        sequelize,
        defaultScope: {
            where: {
              active: true,
            },
        },
        hooks: {
          beforeSave: async (user, options) => {
            if (user.changed('password')) {
              user.passwordChangedAt = new Date() - 1000;
            }
          },
        },
      }
    );
  }

  static associate(models) {
    // Define associations here if needed

    // Each staff member is a user
    this.hasOne(models.Staff, {
      foreignKey: 'nationalId',
      as: 'staff',
    });

    // Each student can make many enrollments 
    this.hasMany(models.Enrollment, {
      foreignKey: 'nationalId',
      as: 'enrollments',
    });

    // each staff member can issue a grade for an enrollment 
    this.hasOne(models.Grade, {
      foreignKey: 'nationalId',
      as: 'grade',
    });
      
  }

  correctPassword = async function (candidatePassword,userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
  };

  changedPasswordAfter = function (JTWTimestamp) {
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
      return JTWTimestamp < changedTimestamp;
    }
    return false;
  };

  createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
  };

}

module.exports = User;