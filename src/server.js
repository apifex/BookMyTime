var express = require('express');
var path = require('path');
var app = express();
app.use(express.static(path.resolve(__dirname, 'dist')));
app.listen(process.env.PORT || 5000, function () { return console.log("server liestening on 5000"); });
