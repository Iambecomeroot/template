var express     = require('express');
var http        = require('http');
var fs          = require('fs');
var path        = require('path');
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var compression = require('compression');

var app         = express();

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

// app.use(favicon(__dirname + '/public/favicon.png'));
app.use(compression({filter: shouldCompress}));
app.use(function(req, res, next){
	var extension = req.url.split('.').pop().split('?')[0];
	if(['js', 'css', 'svg', 'jpg'].indexOf(extension) >= 0){
		res.setHeader("Cache-Control", "max-age=31536000");
	}else{
		res.setHeader("Cache-Control", "max-age=604800");
	}
	return next();
});
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(express.static(__dirname + '/public'));

app.use('/', require('./routes/index.js'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});


module.exports = app;

function shouldCompress(req, res) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false
  }

  // fallback to standard filter function
  return compression.filter(req, res)
}