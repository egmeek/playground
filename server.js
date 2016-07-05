var express = require('express'),
    app = express(),
    passport = require('passport'),
    expressSession = require('express-session'),
    ntlm = require('express-ntlm'),
    mongoose = require('mongoose'),
    favicon = require('serve-favicon');

try{
  var config = require('./config');
  var path = require('path');
  process.env.appRoot = path.resolve(__dirname);
  if(config){
    for(var c in config){
        process.env[c] = config[c];
    }
  }
}
catch(err){
  //config file doesn't exist
  console.log("No configuration file found.");
}

var ntlmConfig ={
  debug: function() {
      var args = Array.prototype.slice.apply(arguments);
      console.log.apply(null, args);
  },
  domain: "QTSEL"
}

mongoose.connect(process.env.mongoconnectionstring);

//configure passport strategies
require(__dirname +'/server/controllers/passport/passport.js')(passport);

app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/qlik', express.static(__dirname + '/node_modules/@qlik/leonardo-ui/dist'));
app.use('/css', express.static(__dirname + '/public/build'));
app.use('/js', express.static(__dirname + '/public/build'));
app.use('/resources', express.static(__dirname + '/public/resources'));
app.use('/views', express.static(__dirname + '/public/views'));
app.use('/configs', express.static(__dirname + '/public/configs'));
app.use('/dictionaries', express.static(__dirname + '/dictionaries'));
app.use(favicon(__dirname + '/public/resources/favicon.ico'));

app.use(expressSession({secret: 'playground'}));
app.use(passport.initialize());
app.use(passport.session());

var accessList = [
  "nwr",
  "bmz",
  "akl",
  "rie",
  "baz",
  "jwr",
  "dsa",
  "pnt",
  "aai",
  "swr",
  "lhr",
  "axt",
  "bfk"
];


app.get('/', function(req, res){
  res.redirect('/home');
});

//load in the routes
var apiRoutes = require(__dirname+'/server/routes/api');
var authRoutes = require(__dirname+'/server/routes/auth');

app.use('/api', apiRoutes);
app.use('/auth', authRoutes);

app.get('/denied', function(req, res){
  res.render(__dirname+'/server/views/denied.jade', {});
});


//all other routes should be dealt with by the client
app.get('/*',  ntlm(ntlmConfig),  function(req, res){
  console.log('trying ot get to page');
  if(req.ntlm && accessList.indexOf(req.ntlm.UserName.toLowerCase())==-1){
    console.log('user doesnt exist');
    res.redirect('/denied');
  }
  else{
    console.log('user is');
    console.log(req.ntlm);
    res.render(__dirname+'/server/views/index.jade', {});
  }
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Server listening on port "+(process.env.PORT || 3000));
});
