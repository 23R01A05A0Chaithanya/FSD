//import express for creating API's endpoints
const express=require("express");
const path=require("path");
const fs=require("fs");
const users=require("./database.json");
var database;
var token="wrong key";
//read database.json
fs.readFile("database.json",function(err,data){
    //check for errors
    if(err) throw err;

    //convert to json
    database=JSON.parse(data);

});
//import jwt for api endpoints authentication
const jwt=require("jsonwebtoken");

const app=express();
const port=3000;

//allow json data
app.use(express.json());

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/login.html');

});
//login route
app.post("/auth",(req,res)=>{
    //get the name to the json body data
    const name=req.body.name;
    console.log(name);
    //get the password to the json body data
    const password=req.body.password;
    console.log(password);
    //make two variable for further use
    let isPresent=false;
    let isPresentIndex=null;
    for(let i=0;i<database.length;i++){
        //if data name is matched verify the password ri8 or wrong
        if(database[i].name==name && database[i].password==password){
            //if both are correct so make iis present var true
            isPresent=true;
            isPresentIndex=i;
            //brek the loop after matching success
            break;
        }


    }
    //if is present is true then create a token and pass to response

    if(isPresent){
        //jwt.sign method used to create token
        const token=jwt.sign(database[isPresentIndex],"secret");
        //pass the data or token in respone
        res.json({
            login:true,
            token:token,
            data:database[isPresent],
        });

    }
    else{
        //if isPresent is false return error
        res.json({
            login:false,
            token:token,
            error:"please check name and password"
        });

    }
});
//verify route
app.post("/verifyToken",(req,res)=>{
    const token=req.body.token;
    if(token){
        const decode=jwt.verify(token,"secret");
        res.json({
            login:true,
            data:decode,

        });
    }
    else{
        res.json({
            login:false,
            data:error
        })
    }
});
app.post('/login',(req,res)=>{
    res.redirect("/login")
});
app.listen(port,()=>{
    console.log(`server is running:http://localhost:${port}/`)
})
