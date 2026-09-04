require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/todo_api';

(async () => {
  await connectDB(MONGO_URI);

  const server = app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
  );

  
  process.on('unhandledRejection', (err) => {
    console.error('Unhandled rejection:', err);
    server.close(() => process.exit(1));
  });
})();
