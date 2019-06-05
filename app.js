'use strict';
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

//const { check,validationResult } = require('express-validator/check');

const indexRouter = require('./routes/index');
const aboutRouter = require('./routes/about');
const contactsRouter = require('./routes/contacts');
const itemRouter = require('./routes/item');
const adminRouter = require('./routes/admin');
const additemRouter = require('./routes/additem');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/index', indexRouter);
app.use('/index/*', indexRouter);
app.use('/about', aboutRouter);
app.use('/contacts', contactsRouter);
app.use('/item', itemRouter);
app.use('/item/*', itemRouter);
app.use('/admin', adminRouter);
app.use('/additem', additemRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  const msgs = ['Cервер не може обробити ваш запит 😔\n\n' + err.message];
  res.render('messages', { messages: msgs });

});

module.exports = app;
