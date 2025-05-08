const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.error('[SERVER] UNCAUGHT EXCEPTION! Shutting down...');
  console.error('[SERVER]', err.name, err.message, err.stack);
  process.exit(1);
});

dotenv.config({
  path: './.env',
});
const app = require('./app');

const port = process.env.PORT || 3000;
const server = app.listen(port).on('error', (err) => {
  console.error('[SERVER] Error starting server:', err.message);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('[SERVER] UNHANDLED REJECTION! Shutting down...');
  console.error('[SERVER]', err.name, err.message, err.stack);
  server.close(() => {
    process.exit(1);
  });
});
