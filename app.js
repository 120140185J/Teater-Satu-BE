const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

//proses
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const paymentRouter = require('./routes/paymentRoutes');
const kategoriRouter = require('./routes/kategoriRoutes');
const imageRouter = require('./routes/imageRoutes');
const analyticsRouter = require('./routes/analyticsRoutes');

//subscription
const subsvideoRouter = require('./routes/subsvideoRoutes');
const subsnaskahRouter = require('./routes/subsnaskahRoutes');
const subgaleriRouter = require('./routes/subsgaleriRoutes');

//utama
const beritaRouter = require('./routes/beritaRoutes');
const beritaKolaborasiRouter = require('./routes/beritakolaborasiRoutes');
const beritaPartnerRouter = require('./routes/beritapatnerRoutes');
const donasiRouter = require('./routes/donasiRoutes');
const tiketRouter = require('./routes/tiketRoutes');
const tiketgratisRouter = require('./routes/tiketgratisRoutes');
const profileRouter = require('./routes/profileRoutes');
const productRouter = require('./routes/productRoutes');
const galeriRouter = require('./routes/galeriRoutes');
const profilAnggotaRouter = require('./routes/profilanggotaRoutes');
const merchRouter = require('./routes/merchRoutes');
const naskahRouter = require('./routes/naskahRoutes');
const programRouter = require('./routes/programRoutes');

//landingpage
const ipvideoRouter = require('./routes/ipvideoRoutes');
const lptestimoniRouter = require('./routes/lptestimoniRoutes');
const lpprogramRouter = require('./routes/lpprogramRoutes');
const lpberitaRouter = require('./routes/lpberitaRoutes');
const lpgaleriRouter = require('./routes/lpgaleriRoutes');
const lpanggotautamaRouter = require('./routes/lpanggotautamaRoutes');
const lpkolaborasiRouter = require('./routes/lpkolaborasiRoutes');
const modalSubsRoutes = require('./routes/modalSubsRoutes');
const landingpageimageRouter = require('./routes/landingpageimageRoutes');

//library
const globalErrorHandler = require('./controllers/errController');
const AppError = require('./utils/appError');
const { startCronJobs } = require('./utils/cronJobs');

const app = express();

app.use(cors());
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to API',
  });
});

//proses
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/payment', paymentRouter);
app.use('/api/v1/image', imageRouter);
app.use('/api/v1/kategoris', kategoriRouter);
app.use('/api/v1/analytics', analyticsRouter);

//subscription
app.use('/api/v1/subsvideos', subsvideoRouter);
app.use('/api/v1/subsnaskahs', subsnaskahRouter);
app.use('/api/v1/subsgaleri', subgaleriRouter);

//landingpage
app.use('/api/v1/ipvideos', ipvideoRouter);
app.use('/api/v1/lptestimonis', lptestimoniRouter);
app.use('/api/v1/lpprograms', lpprogramRouter);
app.use('/api/v1/lpberitas', lpberitaRouter);
app.use('/api/v1/lpgaleris', lpgaleriRouter);
app.use('/api/v1/lpanggotautamas', lpanggotautamaRouter);
app.use('/api/v1/lpkolaborasis', lpkolaborasiRouter);
app.use('/api/v1/landingpageimages', landingpageimageRouter);
app.use('/api/v1/lpmodalsubs', modalSubsRoutes);

//utama
app.use('/api/v1/beritas', beritaRouter);
app.use('/api/v1/beritakolaborasis', beritaKolaborasiRouter);
app.use('/api/v1/beritapartners', beritaPartnerRouter);
app.use('/api/v1/donasis', donasiRouter);
app.use('/api/v1/tiketgratiss', tiketgratisRouter);
app.use('/api/v1/profiles', profileRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/galeris', galeriRouter);
app.use('/api/v1/programs', programRouter);
app.use('/api/v1/profilanggotas', profilAnggotaRouter);
app.use('/api/v1/merchs', merchRouter);
app.use('/api/v1/naskahs', naskahRouter);
app.use('/api/v1', tiketRouter); //semua route harus diatas tiket karena route dasarnya ada di tiket

app.use('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

const sequelize = require('./utils/database');

const sync = async () => {
  await sequelize.sync({ force: false });
  startCronJobs();
};
sync().catch((error) => {
  console.error('[APP] Error syncing database:', error.message, error.stack);
});

app.use(globalErrorHandler);

module.exports = app;
