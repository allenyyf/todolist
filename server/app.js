/// <reference path="typings/index.d.ts" />
"use strict";
var express = require("express");
var mongodb = require("mongodb");
var bodyParser = require("body-parser");
var assert = require("assert");
var crypto = require("crypto");
var app = express();
var mongoClient = mongodb.MongoClient;
app.use(express.static("public"));
app.use(bodyParser.json());
app.post("/data", function (req, res) {
    var itemsData = req.body;
    updateDb(database, itemsData);
    res.end();
});
app.get("/data", function (req, res, doc) {
    console.log("data from server to client");
    findDocument(database, function (doc) {
        res.send(doc);
        console.log(doc);
    });
});
app.post("/login", function (req, res, callback) {
    var loginData = req.body;
    console.log(req.body);
    var account = loginData.account;
    var password = loginData.password;
    findUserData(database, account, password, function () {
        // res.sendFile("html/content.html",{root:"/"})
        res.setHeader('Cache-Control', 'no-cache');
        // res.redirect("/html/content.html")
        res.send("http://127.0.0.1:8080/html/content.html");
    });
});
app.post("/signup", function (req, res) {
    var signupData = req.body;
    console.log(req.body);
    var account = signupData.account;
    var password = signupData.password;
    findUserData(database, account, password, function (doc) {
        if (doc) {
            res.send("账户已存在");
        }
        else {
            var hash = crypto.createHash("sha256");
            hash.update(password);
            console.log(password);
            var savePw = hash.digest("hex");
            console.log(savePw);
            var signupData_1 = {
                "account": account,
                "password": savePw
            };
            insertSignupData(database, signupData_1);
        }
    });
});
app.listen(8080, function () {
    console.log("server is run");
});
var database = null;
var url = "mongodb://localhost:/todolist";
mongoClient.connect(url, function (err, db) {
    console.log("connected mongodb");
    database = db;
});
function updateDb(database, itemsData) {
    var collection = database.collection("todolist");
    collection.update({ _id: itemsData._id }, { $set: itemsData }, { upsert: true }, function (err, res) {
        console.log(itemsData);
    });
}
function findDocument(database, callback) {
    var collection = database.collection("todolist");
    collection.find({}).toArray(function (err, doc) {
        assert.equal(null, err);
        console.log(doc);
        callback(doc);
    });
}
function insertSignupData(database, signupData) {
    var collection = database.collection("userdata");
    collection.insert(signupData, function (err, doc) {
        console.log(doc);
    });
}
function findUserData(database, account, password, callback) {
    var collection = database.collection("userdata");
    collection.findOne({ account: account }, function (err, doc) {
        assert.equal(null, err);
        console.log(doc);
        callback(doc);
    });
}
//# sourceMappingURL=app.js.map