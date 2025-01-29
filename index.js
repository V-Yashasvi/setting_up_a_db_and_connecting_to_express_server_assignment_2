const express = require('express');
const { resolve } = require('path');
const mongoose=require('mongoose')
const dotenv=require('dotenv')
dotenv.config()
const app = express();
const port = 3010;
const mongoURL=process.env.url
const User=require('./schema')
app.use(express.json())
app.use(express.static('static'));

app.get('/', (req, res) => {
  res.send("Home page")
});

app.post('/api/user',async(req, res)=>{
  try{
    const {name, email, password}= req.body
    if (!name|| !email || !password){
      res.status(400).json({error:"All fields are required"});
    }
    const new_user=new User({name, email, password})
    await new_user.save();
    res.status(201).json({message:"User created successfully"})
  }
  catch(error){
    if(error.code===11000){
      res.status(400).json({error:"Email already exists"})
    }
    if(error.name=="ValidationError"){
      res.status(400).json({error:error.message})
    }
    console.error("server error",error)
    res.status(500).json({error:"Internal server error"})
  }
});

app.listen(port, async() => {
  try {
    await mongoose.connect(mongoURL)
    console.log("Connected to database")
  } catch (error) {
    console.error(error)
  }
  console.log(`Example app listening at http://localhost:${port}`);
});

