const User = require('../models/userDetails');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


function isStringValid(string){
  if(string == undefined || string.length === 0){
      return true
  }else{
    return false
  }
}

const signup = async (req,res,next) =>{
  try{
  const {name,email,phoneNumber,password } = req.body;
  if(isStringValid(name) || isStringValid(email) || isStringValid(phoneNumber) || isStringValid(password)){
    return res.status(400).json({err: "Bad parameters--something is missing"})
  }

  const existingUser = await User.findOne({ where: { email } });

  if (existingUser) {
    return res.status(202).json({ message: "Email already in use. Please use a different email." });
  }
  
  const saltrounds = 10;
  bcrypt.hash(password, saltrounds ,async(err,hash) =>{
    if (err) {
      console.log(err);
      return res.status(500).json({ err: "Error hashing password" });
  }
    
    await User.create({name,email,phoneNumber,password: hash})
    const users = await User.findAll();
    const userNames = users.map((user) => user.name);
    res.status(201).json({message:`Successfully created new user`,users: userNames});
  })
  
  }catch(err){
            res.status(500).json(err);
      }
}

function generateAccessToken(id,name){
  return jwt.sign({userId : id, name: name}, process.env.TOKEN);
}

const login = async (req,res) => {
  try{
    const { email, password } = req.body;
    if(isStringValid(email) || isStringValid(password)){
      return res.status(400).json({message: 'Email id or password is missing',success:false})
    }
    console.log(password);
    const user = await User.findAll({where :{email}})
      if(user.length >0){
        bcrypt.compare(password,user[0].password,(err,result) => {
          if(err){
            return res.status(500).json({ message: 'Something went wrong', success: false });
          }
          if(result === true){
            res.status(200).json({success : true,user: user[0],message:"User Logged in Successfully", token: generateAccessToken(user[0].id,user[0].name)});
          }
          else{
          return res.status(201).json({success : false,message:"password is incorrect"})
        }
      })
      }else {
        return res.status(404).json({success:false,message:'User Doesnot exist'})
      }
  }catch(err){
      res.status(500).json({message: err,success: false})
  }
}


module.exports = {
    signup,
    login
}