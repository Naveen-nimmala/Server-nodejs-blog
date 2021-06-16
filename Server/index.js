import express from 'express';
import bodyParser from 'body-parser';
import ejs from 'ejs';
import mongoose from 'mongoose';
import cors from 'cors';
import methodOverride from 'method-override';
import Blog from './models/blogModel.js'
import bcrypt from 'bcrypt';



import session from 'express-session';
import passport from 'passport';
import passportLocalMongoose from 'passport-local-mongoose'

import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import findOrCreate from 'mongoose-findorcreate';

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const saltRounds = 10;

import postRoutes from './routes/posts.js'
import composePost from './routes/compose.js'



import _ from 'lodash';
import $ from 'jquery'
import JSDOM from 'jsdom';


const homeStartingContent = "Node.js is an open-source, cross-platform, back-end JavaScript runtime environment that runs on the V8 engine and executes JavaScript code outside a web browser";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();



// Time

var profileData = 123;
app.use(cors());

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({
  extended: true
}));

app.use(methodOverride('_method'));


// app.set('views', './views')
// app.set('views', path.join(__dirname, 'views')); 
app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views')); 
app.use(express.static("public"));

app.use(session({
  secret: "mysecret",
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());


const CONNECTION_URL = "mongodb://localhost/blogDB"
const PORT = process.env.NODE_ENV || 3000;

mongoose.connect(CONNECTION_URL,  {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(function(){
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
}).catch((error) => console.log(error))

bodyParser.json({ limit: "50mb" })


mongoose.set('useFindAndModify', false);


// const blogSchema = new mongoose.Schema({
//   title: String,
//   content: String,
//   datetime: String
// });

// const Blog =  mongoose.model("Blog", blogSchema)

const userSchema = new mongoose.Schema({
  userName: String,
  emailID: String,
  password: String,
  googleId: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User =  mongoose.model("User", userSchema);

passport.use(User.createStrategy());


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

const isLoggedIn = {
  user :false
}
passport.use(new GoogleStrategy({
    clientID: "549870859910-e4pbat0icieticfp7uinm9bnuj9j4kgp.apps.googleusercontent.com",
    clientSecret: "O3yeuP2UicS9Y6_HO06h_7zF",
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    profileData = profile;
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));


var posts = [];






app.get('/', function (req, res){
  Blog.find({}, function(err, fountItems){
    res.render("home", {
      startContent: homeStartingContent,
      posts: fountItems   
    });
  });
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] })
);

app.get('/auth/google/secrets', 
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    isLoggedIn.user = true;
    // Successful authentication, redirect home.
    res.redirect('/about');
});


app.get("/about", function (req, res){
  if (req.isAuthenticated()){
    console.log("User authnticated")
    res.render("about", {aboutMe: aboutContent});
  } else {
    res.redirect("/")
    console.log("User not authnticated")
  }
})


// app.use('/compose', composePost);


app.get("/contact", function (req, res){
  if (req.isAuthenticated()){
    console.log("User authnticated")
    res.render("contact", {contactMe: contactContent})
  } else {
    res.redirect("/")
    console.log("User not authnticated")
  }
});



app.get("/logout", function (req, res){
  req.logout();
  isLoggedIn.user = false;
  res.redirect("/");
})


app.get("/editPost/:postID",  async (req, res) => {
  let oldBlog = await Blog.findById(req.params.postID, function (err, user){
  })
  res.render("edit", {blog: oldBlog});

});

app.get("/deletePost/:postID",  async (req, res) => {
  let deletePost = await Blog.findByIdAndDelete(req.params.postID, function (err, data) {
    if (err){
        console.log(err)
    }
    else{
        console.log("Deleted : ");
        res.redirect('/');
    }
  });
});



app.put("/update/:postID",  async (req, res) => {
  let updateBlog = await Blog.findById(req.params.postID, function(err, user){
  })
  var date = new Date();  
  var n = date.toDateString();
  var time = date.toLocaleTimeString();
  var dateTime = n + " " + time
  updateBlog.title = req.body.postTitle 
  updateBlog.content = req.body.postData
  updateBlog.datetime = dateTime

  try{
    updateBlog = await updateBlog.save();
    res.redirect(`/posts/${req.body.postTitle}`)
  }catch(error){
    console.log(error)
  }

});

//   Blog.findOneAndUpdate(query, req.newData, {upsert: true}, function(err, doc) {
//     if (err) return res.send(500, {error: err});
//     return res.send('Succesfully saved.');
// });


// router.get("/posts/:postId", function(req, res){

//   Blog.findById(req.params.postId, function(err, existsID){

//     res.render("post", {
//       title: existsID.title,
//       content: existsID.content,
//       datetime: existsID.datetime
//     })
//   });

// })




app.get("/login", function(req, res){
  res.render("login")
})



app.post("/login", function(req, res){

  const user = new User({
   username: req.body.username,
   password: req.body.password
  })

  req.login(user, function(err){
    if(err){
      console.log(err);
    }else{
      passport.authenticate("local")(req, res, function(){
        console.log("login success")
        res.redirect("/")
      })
    }
  })


  // User.find({}, function(err, userss){
  //   for (let i=0;i<userss.length;i++){
  //     if(req.body.email === userss[i].emailID && req.body.password === userss[i].password ){
  //        res.redirect("/")
  //     }else{
  //       console.log("Login UnSuccess")
  //     }
  //   }
  // })
});


app.get("/signup", function(req, res){
  return res.render("signup")


})

app.post("/signup", function (req, res){
  // console.log(req.body.userName)
  // console.log(req.body.password)

  User.register({username: req.body.userName}, req.body.password, function (err, user){
    if (err){
      console.log(err);
      res.redirect("/signup")
    }else{
      passport.authenticate("local")(req, res, function(){
        res.redirect("/about")
      })
    }
  })
  // const newUser = {
  //   userName: req.body.userName,
  //   password: req.body.password,
  //   emailID: req.body.email
  // };
  // console.log(req.body.userName,req.body.password, req.body.email)
  // User.insertMany(newUser, function(err){
  // }) 
  // // posts.push(post);
  // res.redirect("/");
});


// router.listen(POST, function() {
//   console.log("Server started on port 5000");
// });
export default isLoggedIn;

export {profileData};


app.use('/compose', composePost);
app.use('/posts', postRoutes);
