
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');

var app = module.exports = express();

// all environments
app.set('port', 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var routes = require('./routes');
app.get('/', routes.index);
app.get('/fire', routes.fire);
app.get('/getEnv', routes.getEnv);
app.get('/client', routes.client);
app.get('/animate', routes.animate);

// start server
var server = http.createServer(app);
var io = require('socket.io').listen(server);
io.on('connection', function(socket){
  app.on('animate', function(){
    socket.emit('animate');
  });
});

server.listen(app.get('port'));
console.log('server is listening on ' + app.get('port'));

