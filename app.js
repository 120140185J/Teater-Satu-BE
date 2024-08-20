const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const userRouter = require('./routes/userRoutes');
const beritaRouter = require('./routes/beritaRoutes');
const beritaKolaborasiRouter = require('./routes/beritakolaborasiRoutes');
const beritaPartnerRouter = require('./routes/beritapatnerRoutes');
// const kategoriRouter = require('./routes/kategoriRoutes');
const profileRouter = require('./routes/profileRoutes');
const productRouter = require('./routes/productRoutes');
const galeriRouter = require('./routes/galeriRoutes');
const profilAnggotaRouter = require('./routes/profilanggotaRoutes');
const merchRouter = require('./routes/merchRoutes');
const naskahRouter = require('./routes/naskahRoutes');
const imageRouter = require('./routes/imageRoutes');
const landingpageimageRouter = require('./routes/landingpageimageRoutes');
const programRouter = require('./routes/programRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errController');

const app = express();

// add cors
app.use(cors());
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to API',
  });
});
app.use('/api/v1/users', userRouter);
app.use('/api/v1/beritas', beritaRouter);
app.use('/api/v1/beritakolaborasis', beritaKolaborasiRouter);
app.use('/api/v1/beritapartners', beritaPartnerRouter);
// app.use('/api/v1/kategoris', kategoriRouter);
app.use('/api/v1/profiles', profileRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/galeris', galeriRouter);
app.use('/api/v1/programs', programRouter);
app.use('/api/v1/profilanggotas', profilAnggotaRouter);
app.use('/api/v1/merchs', merchRouter);
app.use('/api/v1/naskahs', naskahRouter);
app.use('/api/v1/image', imageRouter);
app.use('/api/v1/landingpageimages', landingpageimageRouter);

app.use('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
const sequelize = require('./utils/database');

const sync = async () => await sequelize.sync({ force: false });
sync()
  .then(() => {
    console.log('Database synced successfully');
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });

app.use(globalErrorHandler);

module.exports = app;
