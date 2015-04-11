// mostly pulled from scotch.io

var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var request        = require('request');

var port = process.env.PORT || 3000;

// app.use(bodyParser.json()); 
// app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
app.use(bodyParser.json({ extended: true })); 

app.use(express.static(__dirname + '/public'));

// i'll fix it later
// app.post('/make_hr', function(req, res){
//   request
//     .post('https://quidapi.herokuapp.com/games/hr', req.body);
// });

app.get('*', function(req, res) {
  res.sendFile(__dirname + '/public/views/index.html');
});

app.listen(port);
console.log('Magic happens on port ' + port);
exports = module.exports = app;