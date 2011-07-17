// Copyright 2011 Robert Scott Dionne. All rights reserved.

var express = require('express');
var http = require('http');


var app = express.createServer();

app.get('/', function(request, response) {
  response.sendfile('animus.html');
});

app.get('/favicon.ico', function(request, response) {
  response.sendfile('favicon.ico');
});

app.get('/src/*', function(request, response) {
  response.sendfile('src/' + request.params[0]);
});

app.listen(8888);
