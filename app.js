//jshint esversion:6

// To keep secure data
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

// To use Passport.js to add cookies and sessions these packages are required
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

//const encrypt = require("mongoose-encryption");
//const md5 = require("md5");
//const bcrypt = require("bcrypt");
//const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/Secrets", {
  useNewUrlParser: true,
});

// Schema for creating a login data
const loginsSchema = new mongoose.Schema({
  username: String,
  password: String,
});

// Salt and hash password, store in db
loginsSchema.plugin(passportLocalMongoose);

// Environment variable is added  from .env file
//loginsSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const Login = mongoose.model("Login", loginsSchema);

// To create local login strategy
passport.use(Login.createStrategy());

passport.serializeUser(Login.serializeUser());
passport.deserializeUser(Login.deserializeUser());

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.get("/secrets", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("secrets");
  } else {
    res.redirect("/login");
  }
});

app.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      console.log(err);
      res.send(err);
    }
    res.redirect("/");
  });
});

app.post("/register", function (req, res) {
  // Register() comes from passport package
  Login.register(
    { username: req.body.username },
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, function () {
          res.redirect("/secrets");
        });
      }
    }
  );

  // Bcrypt with salt and hash
  // bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
  //   const user = new Login({
  //     email: req.body.username,
  //     //password: md5(req.body.password)
  //     password: hash,
  //   });

  //   await user
  //     .save()
  //     .then(res.render("secrets"))
  //     .catch(function (err) {
  //       res.send(err);
  //     });
  // });
});

app.post("/login", async function (req, res) {
  const user = new Login({
    username: req.body.username,
    password: req.body.password,
  });

  req.login(user, function (err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/secrets");
      });
    }
  });

  // Bcrypt with salt and hash
  // const username = req.body.username;
  // // Hash password when user logs in
  // //const password = md5(req.body.password);
  //  const password = req.body.password;

  // await Login.findOne({ email: username }).then(function (user) {
  //   bcrypt.compare(password, user.password, function (err, result) {
  //     if (result === true) {
  //       res.render('secrets');
  //     }
  //     else {
  //       res.send("Username and/or password are incorrect!");
  //     }
  //   });
  // });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
