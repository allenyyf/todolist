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

app.post("/login",(req,res)=>{
    let loginData = req.body
    console.log(req.body)
    let account = loginData.account
    let password = loginData.password
    let hash = crypto.createHash("sha256")
    hash.update(password)
    let passwordHash = hash.digest("hex")
    findUserData(database,account,(doc:any)=>{
        if(doc.password == passwordHash){
            res.send("password is right")
        }else{
            res.send("password is wrong")
        }
    },password)
})


app.post("/signup",(req,res)=>{
    let signupData = req.body
    let account = signupData.account
    let password = signupData.password
    let hash = crypto.createHash("sha256")
    hash.update(password)
    let passwordHash = hash.digest("hex")
    let signupDataToDb = {
        account:account,
        password:passwordHash
    }
    findUserData(database,account,(doc:any)=>{
        let signupData = signupDataToDb
        if(!doc){
            createAccountIndex(database,account,()=>{
                insertSignupData(database,signupData,()=>{
                    res.send("您的注册已成功")
                })
            })   
        }
    })
})


app.post("/signupAccount",(req,res)=>{
    let signupData = req.body
    let account = signupData.account
    findUserData(database,account,(doc)=>{
        if(doc){
            res.send("账户已存在")
        }else{
            res.send("账户名未注册")
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
        console.log(doc);
        callback(doc)
    })
}

function insertSignupData(database:mongodb.Db,signupData:any,callback?:()=>any){
    let collection = database.collection("userdata")
    collection.insert(signupData,(err,doc)=>{
        console.log(doc)
    })
    callback()
}

function findUserData(database:mongodb.Db,account:any,callback:(doc:any)=>any,password?:any){
    let collection = database.collection("userdata")
    collection.findOne({account},(err,doc)=>{
        console.log(doc);
        callback(doc)
    })
}

function createAccountIndex(database:mongodb.Db,account:any,callback:()=>any){
    console.log("createIndex")
    let collection = database.collection("userdata")
    let option = {
        unique:true
    }
    collection.createIndex({user:1},option,(err,indexName)=>{
        console.log(indexName)
        console.log(err)
    })

    collection.indexExists(["user_1","_id_"],function(err,result){
        console.log(result)
    })
    callback()
}




