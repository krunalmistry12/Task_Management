import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import db from '../db.js '

const router=express.Router();

//register new user
router.post('/register',(req,res)=>{
  const {username,password}=req.body

  //encrypt password
  const hashedPass=bcrypt.hashSync(password,8)
  // console.log(hashedPass);

  //save the new user and hashed pass
  try {
    const insertUser=db.prepare(`INSERT INTO users (username,password) VALUES(?,?)`)
    const result=insertUser.run(username,hashedPass)
     //add first todo for user
     const defaultTodo=`hello add your todo`
     const insertTodo=db.prepare(`INSERT INTO todos(user_id,task) VALUES(?,?)`)
     insertTodo.run(result.lastInsertRowid,defaultTodo)

     //create a token 
     const token=jwt.sign({id:result.lastInsertRowid},process.env.JWT_SECRET,{expiresIn:'24h'})
     res.json({token}) 
  } catch (err) {
    console.log(err.message);
    res.sendStatus(503)
    
  }
  
  // console.log(username,password);
  // res.sendStatus(201)
})

router.post('/login',(req,res)=>{
  const {username,password}=req.body
  try {
    const getUser=db.prepare(`SELECT * FROM users WHERE username=?`)
    const user = getUser.get(username)

    if(!user) {return res.status(404).send({message:"users not found"})}
    const passwordValid=bcrypt.compareSync(password,user.password)
    if(!passwordValid) {return res.status(401).send({message:"invalid password"})}

    const token=jwt.sign({id:user.id},process.env.JWT_SECRET_SECRET,{expiresIn:'24h'})
    res.json({token})
  } catch (err) {
    console.log(err.message);
    res.sendStatus(503);
  }
})

export default router



