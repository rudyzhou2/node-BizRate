var express = require('express');
var util = require('util');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var validator = require('express-validator');
var ejs = require('ejs');
var engine = require('ejs-mate');
var mongoose = require('mongoose');
var session = require('express-session');
const MongoStore = require('connect-mongo')(session);
var passport = require('passport');
var flash = require('connect-flash');
var secret = require('./secret/secret');
//enable ssl
const https = require('https');
const fs = require('fs');

var app = express();

//read ssl cert
const options = {
    cert: fs.readFileSync('./ssl/localhost.cer'),
    key: fs.readFileSync('./ssl/localhost.key')
};
//connect to mongoose
mongoose.Promise = global.Promise;
mongoose.connect(secret.dbAuth.connString);

require('./config/passport');
require('./secret/secret');

app.use(express.static('public'));

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
//place validator after bodyParser
app.use(validator());

//login passport config
//setup sessions in mongo db via connect-mongo
app.use(session({
  secret: 'keytest',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

require('./routes/user')(app, passport);

app.listen(process.env.PORT || 8080, function(){
  util.log('App running on predefined port');
});
https.createServer(options, app).listen(8443);
