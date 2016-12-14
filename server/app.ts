
/// <reference path="typings/index.d.ts" />

import * as express from "express"
import * as mongodb from "mongodb"
import * as bodyParser from "body-parser"
import * as assert from "assert"
import * as crypto from "crypto"

let app = express()
let mongoClient = mongodb.MongoClient

app.use(express.static("public"))
app.use(bodyParser.json())

app.post("/data",function(req,res){
    let itemsData = req.body
    updateDb(database,itemsData)
    res.end()
})

app.get("/data",function(req,res,doc){
    console.log("data from server to client")
    findDocument(database,(doc)=>{
        res.send(doc)
        console.log(doc)
    })
})

app.post("/login",(req,res,callback)=>{
    let loginData = req.body
    console.log(req.body)
    let account = loginData.account
    let password = loginData.password
    findUserData(database,account,password,()=>{
        // res.sendFile("html/content.html",{root:"/"})
        res.setHeader('Cache-Control', 'no-cache')
        // res.redirect("/html/content.html")
        res.send("http://127.0.0.1:8080/html/content.html")
    })
})


app.post("/signup",(req,res)=>{
    let signupData = req.body
    console.log(req.body)
    let account = signupData.account
    let password = signupData.password
    findUserData(database,account,password,(doc)=>{
        if(doc){
            res.send("账户已存在")
        }else{
            let hash = crypto.createHash("sha256")
            hash.update(password)
            console.log(password)
            let savePw = hash.digest("hex")
            console.log(savePw)
            let signupData = {
                "account":account,
                "password":savePw
            }
            insertSignupData(database,signupData)
        }    
    })
})




app.listen(8080,()=>{
    console.log("server is run")
})


let database:any = null;
let url = "mongodb://localhost:/todolist"
mongoClient.connect(url,(err,db)=>{
    console.log("connected mongodb")
    database = db;
})


function updateDb(database:mongodb.Db,itemsData:any){
    let collection = database.collection("todolist")
    collection.update(
        {_id:itemsData._id},
        {$set:itemsData},
        {upsert:true},
        (err,res)=>{
            console.log(itemsData)
        }
    )
}

function findDocument(database:mongodb.Db,callback:(doc:any)=>any){
    let collection = database.collection("todolist")
    collection.find({}).toArray((err,doc)=>{
        assert.equal(null,err);
        console.log(doc);
        callback(doc)
    })
}

function insertSignupData(database:mongodb.Db,signupData:any){
    let collection = database.collection("userdata")
    collection.insert(signupData,(err,doc)=>{
        console.log(doc)
    })
}

function findUserData(database:mongodb.Db,account:any,password:any,callback:(doc:any)=>any){
    let collection = database.collection("userdata")
    collection.findOne({account},(err,doc)=>{
        assert.equal(null,err);
        console.log(doc);
        callback(doc)
    })
}




