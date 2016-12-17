/// <reference path="typings/index.d.ts" />
"use strict";
var express = require("express");
var mongodb = require("mongodb");
var bodyParser = require("body-parser");
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
app.post("/login", function (req, res) {
    var loginData = req.body;
    console.log(req.body);
    var account = loginData.account;
    var password = loginData.password;
    var hash = crypto.createHash("sha256");
    hash.update(password);
    var passwordHash = hash.digest("hex");
    findUserData(database, account, function (doc) {
        if (doc.password == passwordHash) {
            res.send("password is right");
        }
        else {
            res.send("password is wrong");
        }
    }, password);
});
app.post("/signup", function (req, res) {
    var signupData = req.body;
    var account = signupData.account;
    var password = signupData.password;
    var hash = crypto.createHash("sha256");
    hash.update(password);
    var passwordHash = hash.digest("hex");
    var signupDataToDb = {
        account: account,
        password: passwordHash
    };
    findUserData(database, account, function (doc) {
        var signupData = signupDataToDb;
        if (!doc) {
            createAccountIndex(database, account, function () {
                insertSignupData(database, signupData, function () {
                    res.send("您的注册已成功");
                });
            });
        }
    });
});
app.post("/signupAccount", function (req, res) {
    var signupData = req.body;
    var account = signupData.account;
    findUserData(database, account, function (doc) {
        if (doc) {
            res.send("账户已存在");
        }
        else {
            res.send("账户名未注册");
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
        console.log(doc);
        callback(doc);
    });
}
function insertSignupData(database, signupData, callback) {
    var collection = database.collection("userdata");
    collection.insert(signupData, function (err, doc) {
        console.log(doc);
    });
    callback();
}
function findUserData(database, account, callback, password) {
    var collection = database.collection("userdata");
    collection.findOne({ account: account }, function (err, doc) {
        console.log(doc);
        callback(doc);
    });
}
function createAccountIndex(database, account, callback) {
    console.log("createIndex");
    var collection = database.collection("userdata");
    var option = {
        unique: true
    };
    collection.createIndex({ user: 1 }, option, function (err, indexName) {
        console.log(indexName);
        console.log(err);
    });
    collection.indexExists(["user_1", "_id_"], function (err, result) {
        console.log(result);
    });
    callback();
}
//# sourceMappingURL=app.js.map