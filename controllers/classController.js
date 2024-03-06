const Class = require('../models/classModel');
const handlerFactory = require('./handlerFactory');

exports.getAllClasses = handlerFactory.getAll(Class);
exports.getClass = handlerFactory.getOne(Class);
exports.createClass = handlerFactory.createOne(Class);
exports.updateClass = handlerFactory.updateOne(Class);
exports.deleteClass = handlerFactory.deleteOne(Class);
