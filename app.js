//jshint esversion:6

require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
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
loginsSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

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

app.post("/register", async function (req, res) {
  const user = new Login({
    email: req.body.username,
    password: req.body.password,
  });

  //await Login.insertMany([user]);
  await user
    .save()
    .then(res.render("secrets"))
    .catch(function (err) {
      res.send(err);
    });
});

app.post("/login", async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  await Login.findOne({ email: username }).then(function (user) {
    if (user.password === password) {
      res.render("secrets");
    } else {
      res.send("Username and/or password are incorrect!");
    }
  });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
