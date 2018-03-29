var express = require('express');
var util = require('util');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var engine = require('ejs-mate');
var mongoose = require('mongoose');
var session = require('express-session');
const MongoStore = require('connect-mongo')(session);
var passport = require('passport');
var flash = require('connect-flash');

var app = express();

//connect to mongoose
mongoose.connect('mongodb://ratemetest:ratemetest@ds127139.mlab.com:27139/rateme')
app.use(express.static('public'));

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//login passport config
//setup sessions in mongo db via connect-mongo
app.use(session({
  secret: 'keytest',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));

require('./routes/user')(app);

app.listen(process.env.PORT || 3000, function(){
  util.log('App running on predefined port');
});
