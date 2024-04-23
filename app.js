const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const userRouter = require('./routes/userRoutes');
const teacherRouter = require('./routes/teacherRoutes');
const beritaRouter = require('./routes/beritaRoutes');
const kategoriRouter = require('./routes/kategoriRoutes');
const studentRouter = require('./routes/studentRoutes');
const classRouter = require('./routes/classRoutes');
const profileRouter = require('./routes/profileRoutes');
const productRouter = require('./routes/productRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errController');

const app = express();

// add cors
app.use(cors());
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use(express.json());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/teachers', teacherRouter);
app.use('/api/v1/beritas', beritaRouter);
app.use('/api/v1/kategoris', kategoriRouter);
app.use('/api/v1/classes', classRouter);
app.use('/api/v1/students', studentRouter);
app.use('/api/v1/profiles', profileRouter);
app.use('/api/v1/products', productRouter);

app.use('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
const sequelize = require('./utils/database');

const sync = async () => await sequelize.sync();
sync()
  .then(() => {
    console.log('Database synced successfully');
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });

app.use(globalErrorHandler);

module.exports = app;
