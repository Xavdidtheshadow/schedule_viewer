// mostly pulled from scotch.io

var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');

var port = process.env.PORT || 3000;

// app.use(bodyParser.json()); 
// app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
app.use(bodyParser.urlencoded({ extended: true })); 

app.use(express.static(__dirname + '/public'));

// require('./app/routes')(app); 

app.listen(port);
console.log('Magic happens on port ' + port);
exports = module.exports = app;