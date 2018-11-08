var express = require('express');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var config = require('./config');
var app = express();
var googleProfile = {};
var path = require('path');
app.use(express.static('assets'));


//utrzymanie sesji logowanie
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

//skonfigurowanie żądania autoryzacji do Google
passport.use(new GoogleStrategy({
  clientID: config.GOOGLE_CLIENT_ID,
  clientSecret:config.GOOGLE_CLIENT_SECRET,
  callbackURL: config.CALLBACK_URL
},
function(accessToken, refreshToken, profile, cb) {
  googleProfile = {
      id: profile.id,
      displayName: profile.displayName
  };
  cb(null, profile);
}
));

app.set('view engine', 'pug');
app.set('views', './views');
app.use(passport.initialize());
app.use(passport.session());

//stworzenie endpointów dla aplikacji //app routes
app.get('/', function(req, res){
  res.render('index', { user: req.user });
});

app.get('/logged', function(req, res){
  res.render('logged', { user: googleProfile });
  // var filePath = "assets/cat.jpg"
  // var resolvedPath = path.resolve(filePath);
  // console.log(resolvedPath);
  // res.sendFile(resolvedPath);
});
//Passport routes
app.get('/auth/google',
  passport.authenticate('google', {
    scope : ['profile', 'email', 'https://www.googleapis.com/auth/plus.me']
}));
app.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect : '/logged',
    failureRedirect: '/'
  }));

app.listen(3000);
