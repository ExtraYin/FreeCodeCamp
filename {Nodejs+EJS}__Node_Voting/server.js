const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const app = express();


// --------------------------------------------------------------
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

var db;

// change the username and password to your own.
MongoClient.connect('mongodb://[username]:[password]@ds019826.mlab.com:19826/voting_app', (err, database) => {
    if (err) return console.log(err);
    db = database;
});

// --------------------------------------------------------------
app.listen(3000, () => {
    console.log('listening on 3000');
});

app.get('/', (req, res) => {
    db.collection('polls').find().toArray((err, result) => {
        if (err) return console.log(err);
        // renders index.ejs
        res.render('index.ejs', { polls: result });
    })
});

app.post('/AddPoll', (req, res) => {
    var options = {};
    var poll_name = req.body['poll'];
    var options_value = req.body['options'].replace(/ /g, "_").split(',');
    for(var i=0; i<options_value.length; i++){
        options[options_value[i]] = 0;
    }

    db.collection('polls').save({"name": poll_name, "options": options}, (err, result) => {
        if (err) return console.log(err);
        console.log('saved to database');
        res.redirect('/');
    })
});

app.post('/vote', (req, res) => {
    var referer_url = req.headers['referer'];
    console.log(req.body);
    if (req.body['poll_options']) {
        var inc_option = req.body['poll_options'];
        var poll_id = referer_url.match(/.*\/polls\/(.+)/)[1];
        poll_id = new ObjectID(poll_id);
        console.log("Updating polls: " + inc_option);
        db.collection('polls').find({ "_id": poll_id}).toArray((err, result) => {
            if (err) return console.log(err);
            var old_poll = result[0];
            old_poll['options'][inc_option] += 1;
            db.collection('polls').update(
                    {_id: poll_id},
                    {'$set': {options: old_poll['options']}}
            );
        });
    }
    res.redirect(referer_url);
});

app.get('/polls/*', (req, res) => {
    // poll details
    var poll_id = req.url.match(/\/polls\/(.+)/)[1];
    poll_id = new ObjectID(poll_id);
    console.log("showing details of " + poll_id);
    db.collection('polls').find({ "_id": poll_id}).toArray((err, result) => {
        if (err) return console.log(err);
        // renders polldetails.ejs
        console.log(result[0]);
        res.render('polldetails.ejs', { poll_details: result[0] });
    });
});
