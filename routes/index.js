var qrcode = require('qrcode');
var os = require('os');
var app = require('../app');
var ip = getIP();
var port = app.get('port');
var socket = app.get('socket');
var url = ['http://', ip, ':', port, '/', 'fire'].join('');

/*
 * GET home page.
 */

exports.index = function(req, res){
  qrcode.toDataURL(url, function(err, img){
    if (err) {
      res.send(err.message);
    } else {
      res.render('index', {
        url: url,
        data: img,
        ip: ip,
        port: socket
      })
    }
  });
};

/**
 * GET fire client
 */
exports.fire = function(req, res){
  app.emit('fire');

  res.end();
};

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