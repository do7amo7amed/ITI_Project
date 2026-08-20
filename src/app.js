///src/app.js
//express app config

const express = require('express');
const resourcesRoutes = require('./routes/resourceRoutes');
const courseRoutes = require('./routes/courseRoutes')
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const {errorHandler, notFoundMiddleware, logger} = require('./middlewares');

const app = express();

app.use(logger);
//parses incoming json requests body
app.use(express.json());
//parses URL-encoded request body for html forms
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/resources', resourcesRoutes);
app.use('/api/auth', authRoutes);

//initial health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is healthy' });
});

app.use(notFoundMiddleware)

app.use(errorHandler);

module.exports = app;
