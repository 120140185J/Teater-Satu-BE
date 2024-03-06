const xlsx = require('xlsx');
const multer = require('multer');
const Student = require('../models/studentModel');
const handlerFactory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');

exports.getAllStudents = handlerFactory.getAll(Student);
exports.getStudent = handlerFactory.getOne(Student);
exports.createStudent = handlerFactory.createOne(Student);
exports.updateStudent = handlerFactory.updateOne(Student);
exports.deleteStudent = handlerFactory.deleteOne(Student);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

exports.uploadStudents = upload.single('file');

exports.importStudents = catchAsync(async (req, res, next) => {
  // Get the uploaded file from the request
  const { file } = req;

  // Read the file using the xlsx library
  const workbook = xlsx.read(file.buffer, { type: 'buffer' });

  // Get the first worksheet in the workbook
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];

  // Convert the worksheet to an array of objects using the xlsx library
  const data = xlsx.utils.sheet_to_json(worksheet);

  // Map the array of objects to an array of Student instances
  const dataStudents = data.map((student) => ({
    name: student.Nama,
    nis: student.NIS,
    age: student.Umur,
    address: student.Alamat,
  }));

  // Save the students to the database
  await Student.bulkCreate(dataStudents);

  res.status(200).json({
    status: 'success',
    message: 'Students imported successfully',
  });
});
