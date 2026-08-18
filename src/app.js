const express = require('express');
const resourcesRoutes = require('./routes/resourcesRoutes');
const {errorHandler, notFoundMiddleware} = require('./middlewares');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/api/resources', resourcesRoutes);

app.use(notFoundMiddleware)

app.use(errorHandler);

module.exports = app;
