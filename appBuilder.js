"use strict";
const express = require('express');
const morgan = require('morgan');
const path = require('path');

const errorController = require('./controllers/ErrorController');
const mainRouter = require('./routes/MainRouter');
const dbConnection = require('./db/Sequelize');

exports.buildApp = () => {
  const app = express();
  const database = dbConnection.init();

  database.sequelize.sync();

  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, '/static')));
  app.use(morgan(process.env.ENVIRONMENT));

  if (process.env.ENVIRONMENT == "dev") { // Disable cache in development environment
    app.use(function (req, res, next) {
      res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      res.header('Expires', '-1');
      res.header('Pragma', 'no-cache');
      next();
    });
  }

  app.use('/', mainRouter(database));

  app.use(errorController.handle404); // 404 Handler
  app.use(errorController.handleOther); // Error handler for expected errors
  app.use(errorController.handle500); // Error handler for unexpected errors

  return app;
};