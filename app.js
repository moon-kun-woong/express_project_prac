var express = require('express');
var app = express();
app.listen('3001');


var logger = require('morgan');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


var indexRouter = require('./routes/index');
app.use('/', indexRouter);


var createError = require('http-errors');
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status);
  res.render(err);
});

module.exports = app;
