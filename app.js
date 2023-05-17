//jshint esversion:6

// To keep secure data
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
//const encrypt = require("mongoose-encryption");
//const md5 = require("md5");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/Secrets", {
  useNewUrlParser: true,
});

// Schema for creating a login data
const loginsSchema = new mongoose.Schema({
  email: String,
  password: String,
});

// Environment variable is added  from .env file
//loginsSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const Login = new mongoose.model("Login", loginsSchema);

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {
  bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
    const user = new Login({
      email: req.body.username,
      //password: md5(req.body.password)
      password: hash,
    });

    await user
      .save()
      .then(res.render("secrets"))
      .catch(function (err) {
        res.send(err);
      });
  });
});

app.post("/login", async function (req, res) {
  const username = req.body.username;
  // Hash password when user logs in
  //const password = md5(req.body.password);
   const password = req.body.password;

  await Login.findOne({ email: username }).then(function (user) {
    bcrypt.compare(password, user.password, function (err, result) {
      if (result === true) {
        res.render('secrets');
      }
      else {
        res.send("Username and/or password are incorrect!");
      }
    });
  });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
