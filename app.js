const express = require('express');
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy;
const FB = require('fb');
var mongoose = require('mongoose');

var url = "mongodb+srv://chuvanvu:chuvanvu@data-fb-dbamu.mongodb.net/test?retryWrites=true";
mongoose.connect(url, function(err) {
  if(err) throw err;
  console.log("Database connected !");
});

var UserModel = require('./models/UserModel');
var PostInPageModel = require('./models/PostInPageModel');
var UserPostModel = require('./models/UserPostModel');


var app = express();
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.listen(80);
app.use(passport.initialize());

//các trường dữ liệu cần lấy từ bài viết
var fieldArray = ['id', 'caption', 'created_time', 'description', 'cities', 'from', 'full_picture', 'icon', 'is_hidden', 'is_published', 'link', 'message', 'message_tags', 'name'];
var fieldUserInfo = ["id", "name", "age_range", "birthday", "email", "first_name", "last_name", "education", "favorite_athletes", "favorite_teams", "link", "languages", "location", "middle_name", "quotes", "security_settings", "short_name", "significant_other", "sports", "picture", "likes"];

var fieldUserPost = ["id", "name", "is_hidden", "is_published", "from", "full_picture", "created_time", "picture", "updated_time", "link", "description", "message", "status_type"];

var appid = '208855959653223';
var appsecret = '1d032d45a785a592b8da6fdf906debc3';

//login facebook với passport-facebook
passport.use(new FacebookStrategy({
    clientID: appid,
    clientSecret: appsecret,
    callbackURL: "http://localhost/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    var fb = new FB.Facebook({version: 'v3.1'});
    FB.api('oauth/access_token', {
        client_id: appid,
        client_secret: appsecret,
        grant_type: 'client_credentials'
    }, function (res) {
        if(!res || res.error) {
            console.log(!res ? 'error occurred' : res.error);
            return;
        }
        // console.log(accessToken);
        FB.setAccessToken(accessToken);
        
        //lấy bài viết của người dùng, limit 20
        FB.api(profile.id + '/posts', { fields: fieldUserPost, limit: 20 }, function(listPosts) {
            listPosts.data.forEach(function(listpost) {
                UserPostModel.find({id: listpost.id}, function(err, result) {
                  if(err) throw err;
                  if(result.length == 0) {
                    UserPostModel.create({
                        id: listpost.id,
                        name: listpost.name,
                        is_hidden: listpost.is_hidden,
                        is_published: listpost.is_published,
                        from: listpost.from,
                        full_picture: listpost.full_picture,
                        created_time: listpost.create,
                        picture: listpost.picture,
                        updated_time: listpost.updated_time,
                        link: listpost.link,
                        description: listpost.description,
                        message: listpost.message
                    }, function(err, result) {
                        console.log('User Post inserted !');
                    })
                  }
                })
            })
        })

        //lấy danh sách page của người dùng
        FB.api('me/accounts?type=page', function (listPage) {
          if(!listPage || listPage.error) {
            console.log(!listPage ? 'error occurred' : listPage.error);
            return;
          }
          if (listPage.data.length == 0) {
            console.log("Người dùng không có page nào");
          } 
          listPage.data.forEach(function(x) {
            // console.log(x.id);
            // lây ra danh sách bài viết ở các page
            FB.api(x.id+'/posts', { fields: fieldArray }, function (res) {
              if(!res || res.error) {
                console.log(!res ? 'error occurred' : res.error);
                return;
              }
              res.data.forEach(function(p) {
                PostInPageModel.find({id: p.id}, function(err, result) {
                  if(err) throw err;
                  if(result.length == 0) {
                    PostInPageModel.create({
                        id: p.id, 
                        caption: p.caption, 
                        created_time: p.created_time, 
                        description: p.description, 
                        cities: p.cities, 
                        from: p.from, 
                        full_picture: p.full_picture, 
                        icon: p.icon, 
                        is_hidden: p.is_hidden, 
                        is_published: p.is_published, 
                        link: p.link, 
                        message: p.message, 
                        message_tags: p.message_tags, 
                        name: p.name

                    }, function(err, res) {
                      console.log("Post In Page  inserted !");
                    });
                  }
                })
              });
            });
          });
        });

        FB.api(profile.id, { fields: fieldUserInfo, access_token: accessToken }, function (user) {
            UserModel.find({id: user.id}, function(err, result) {
              if (err) {
                throw err;
              } else if(result.length == 0) {
                UserModel.create({
                  id: user.id,
                  age_range: user.name,
                  birthday: user.birthday, 
                  email: user.email, 
                  first_name: user.first_name, 
                  last_name: user.last_name, 
                  education: user.education, 
                  favorite_athletes: user.favorite_athletes, 
                  favorite_teams: user.favorite_teams, 
                  link: user.link, 
                  languages: user.languages, 
                  location: user.location, 
                  middle_name: user.middle_name, 
                  quotes: user.quotes, 
                  security_settings: user.security_settings, 
                  short_name: user.short_name, 
                  significant_other: user.significant_other, 
                  sports: user.sports, 
                  picture: user.picture, 
                  likes: user.likes
                }, function(err, res) {
                  if(err) throw err;
                  console.log("Inserted !");
                })
              }
            });
        });



    });


    // console.log(accessToken);
    done(null,profile);
  }
));
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback',
passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login' }));

app.get('/', (req, res) => {
res.render('home');
});
