var express = require('express');
var app = express();

//db stuff
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var entrySchema = new Schema({
	name: String,
	score: Number
});

var Entry = mongoose.model('Entry', entrySchema);

mongoose.connect('mongodb://apg:apg@ds023468.mlab.com:23468/apgtestdb');

var port = process.env.PORT || 3000;

//body-parser stuff
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();

app.use('/assets', express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

app.use('/', function (req, res, next) {
	console.log('Request Url:' + req.url);

	next();
});

app.get('/', function(req, res) {
    // get all the entries
	Entry.find({}, function(err, entries) {
		if (err) throw err;
        res.render('index', {entries: entries});
	});
});

app.post('/', urlencodedParser, function(req, res) {
    new Entry({
        name: req.body.name,
        score: req.body.score
    }).save(function(err){
        if (err) throw err;  
    });
    res.redirect('/');
});

app.listen(port);