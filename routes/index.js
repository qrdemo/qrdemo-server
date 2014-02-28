
var os = require('os');
var app = require('../app');
var ip = getIP();
var port = app.get('port');
var url = ['http://', ip, ':', port, '/', 'fire'].join('');


app.set('groupid',0)
app.set('clientid', 0);

/**
 * GET fire client
 */
exports.fire = function(req, res){
  app.emit('fire');
  /*var socket = app.get('socket');
  if (socket) {
    console.log('socket exists')
    socket.emit('fire');
  } else {
    console.log('socket is undefined');
  }*/
  res.end();
};

exports.getEnv = function(req, res){
  var o = {
    ip: ip,
    port: port
  };
  var method = req.query['callback'] || 'callback';
  res.send(method + '(' + JSON.stringify(o) + ')');
};

exports.client = function(req, res){
  var groupid = app.set('groupid');
  var clientid = app.get('clientid');

  ++clientid;
  app.set('clientid', clientid);
  res.render('client', {
    url: ['http://', ip, ':', port, '/animate?clientid=', groupid + '' + clientid].join('')
  });
};

exports.animate = function(req, res){
  var groupid = app.get('groupid');
  var cid = req.query.clientid;

  console.log(cid)

  // 同组第一
  if (cid == groupid + '' + 1) {
    app.emit('animate');
  }

  res.end();
}

function getIP(){
  var info = os.networkInterfaces();

  for (var k in info) {
    var group = info[k];
    for (var i = 0;i < group.length;i++) {
      var pkg = group[i];
      if (!pkg.internal && pkg.family == 'IPv4') {
        return pkg.address;
      }
    }
  }

  return '';
}
