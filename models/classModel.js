const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const Student = require('./studentModel');
const Teacher = require('./teacherModel');

const Class = sequelize.define('Class', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: DataTypes.STRING,
});

// Define the many-to-many relationship between Class and Student
Student.belongsTo(Class, { foreignKey: 'class_id' });
Class.hasMany(Student, { foreignKey: 'class_id' });

// Define the many-to-one relationship between Class and Teacher
Class.belongsTo(Teacher, { foreignKey: 'teacher_id' });
Teacher.hasMany(Class, { foreignKey: 'teacher_id' });

module.exports = Class;
