const express = require('express');
const cors = require('cors');
const todoRoutes = require('./routes/todo.routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

// global middleware
app.use(cors());
app.use(express.json({ limit: '10kb' })); 

app.use((req, _res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// routes 
app.get('/health', (_req, res) => res.json({ success: true, status: 'ok' }));
app.use('/api/todos', todoRoutes);

// error handling 
app.use(notFound);
app.use(errorHandler);

module.exports = app;
