var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');






var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var cellRouter = require('./routes/cell');
var projectRouter = require('./routes/project')
var domainRouter = require('./routes/domain')
var processRouter = require('./routes/process')



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));


app.all('*', function(req, res, next) {

  console.log(`###req is `,req.url)

  res.header("Access-Control-Allow-Origin", "http://localhost:8080")

// res.header('Access-Control-Allow-Origin', '*');
res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild, isfrom');
res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
res.header('Access-Control-Allow-Credentials',true)

if (req.method == 'OPTIONS') {
  res.send(200); 
}
else {
  res.ok = function(data) {
    return res.json({success:true,data})
  }

  res.fail = function(error) {
    return res.json({success:false,errorMsg:error})
  }

  next();
}
});



app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/cell',cellRouter);
app.use('/project',projectRouter)
app.use('/domain',domainRouter)
app.use('/process',processRouter)

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

module.exports = app;
