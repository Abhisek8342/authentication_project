//jshint esversion:6
import 'dotenv/config';
import express from "express";
import ejs from "ejs";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import encrypt from "mongoose-encryption";

const app= express();
const port=3000;
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/userDB").catch(err=>console.log(err)).then(()=>console.log("Database is connected successfully..."));

const userSchema = new mongoose.Schema({
  email:{
    type:String,
    required:true,
  },
  password:{
    type:String,
    required:true,
  }
});

console.log(process.env.API_KEY);
userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

const User =mongoose.model("User",userSchema);

app.get("/",(req,res)=>{
   res.render("home.ejs");
});

app.get("/login",(req,res)=>{
    res.render("login.ejs");
 });

 app.get("/register",(req,res)=>{
    res.render("register.ejs");
 });

 app.post("/register",(req,res)=>{
    const user = new User({
       email:req.body.username,
       password:req.body.password,
    });
    user.save().catch(err=>console.log(err)).then(()=>
    res.render("secrets.ejs")
    );
  });

 app.post("/login",(req,res)=>{
     const Useremail = req.body.username;
     const Userpassword = req.body.password;
     User.findOne({email:Useremail}).catch((err)=>console.log("No record found")).then((user)=>{
           if(user.password === Userpassword){
            res.render("secrets.ejs");
           }else{
            res.send("Oops! you are entering worng username or password !");
           }
     });
  
 });


app.listen(port,()=>{console.log(`Server started on ${port}.`);})