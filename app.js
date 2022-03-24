var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
<<<<<<< HEAD

var indexRouter = require('./routes/index');
const clientAddress='https://z-prefix-news.herokuapp.com';

var app = express();

=======
var cors = require('cors')
const pg = require('knex')({client: 'pg'});
var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

>>>>>>> 00dde2c (day-one-progress)
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
<<<<<<< HEAD
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin',clientAddress)
  res.header('Access-Control-Allow-Credentials', true)
  res.header("Access-Control-Allow-Headers", "include, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
     next();
});
=======
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())
>>>>>>> 00dde2c (day-one-progress)
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

<<<<<<< HEAD
module.exports = app;
=======
module.exports = app;
>>>>>>> 00dde2c (day-one-progress)
