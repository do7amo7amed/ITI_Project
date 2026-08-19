const express = require('express');
const resourcesRoutes = require('./routes/resourceRoutes');
const authRoutes = require('./routes/authRoutes');
const {errorHandler, notFoundMiddleware} = require('./middlewares');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


app.use('/api/resources', resourcesRoutes);

app.use('/api/auth', authRoutes);

app.use(notFoundMiddleware)

app.use(errorHandler);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is healthy' });
});

module.exports = app;
