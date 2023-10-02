const User = require('../models/userDetails');
const bcrypt = require('bcrypt');


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


module.exports = {
    signup,
}