const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')
const requireLogin = require('../middleware/requireLogin')

// protected verifies whether user has logged in or not if not then it is not allowded to access the page
// this response uses requirelogin middleware for verifying if user has signed in or not.
router.get('/protected',requireLogin,(req,res)=>{
    res.send("Hello User");
})

// Signup page helps the user for registering in Twitter API
// This uses bcrypt library for generating hashed password and store it in the mongo database under User database.
// User can signup by providing email, password and username in the body
router.post('/signup',(req,res)=>{
    const {name,email,password} = req.body
    if(!email || !password || !name)
    {
        return res.status(422).json({error:"Please Add all the fields"});
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser)
        {
            return res.status(422).json({error:"User already exists with that email"});
        }
        bcrypt.hash(password,12)
        .then(hashedpassword=>{
            const user = new User({
                email,
                password:hashedpassword,
                name
            })
    
            user.save()
            .then(user=>{
                res.json({message:"Saved Successfully"});
            })
            .catch(err=>{
                console.log(err);
            })
        })
    })
    .catch(err=>{
        console.log(err);
    })
})

// signin helps the user for logging in into the Twitter API
// For every time user signed in it generates unique jwt token using jsonwebtoken library 
// User can sign in by providing 
router.post('/signin',(req,res)=>{
    const {email,password} = req.body
    if(!email || !password)
    {
        return res.status(422).json({error:"Please Provide Email or Password"});
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser)
        {
            return res.status(422).json({error:"Invalid Email or Password"});
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch)
            {
                // res.json({message:"Successfully Signed In"})
                const token = jwt.sign({_id : savedUser._id},JWT_SECRET);
                res.json({token});
            }
            else
            {
                return res.status(422).json({error:"Invalid Email or Password"});
            }
        })
        .catch(err=>{
            console.log(err);
        })
    })
})


module.exports = router
