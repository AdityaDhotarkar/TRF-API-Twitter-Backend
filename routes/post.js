const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model("Post")

// allpost shows all the tweets created by all the users like feed on the twitter
router.get('/allpost',(req,res)=>{
    Post.find()
    .populate("postedBy","_id name email")
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})

// createpost function creates tweet which mainly contains title of the tweet and body of the tweet
// This post then stored in the mongo database under the post database
router.post('/createpost',requireLogin,(req,res)=>{
    const {title,body} = req.body
    // Condition to check if title or body is empty or not.
    if(!title || !body)
    {
        return res.status(422).json({error:"Please Add all the fields"})
    }
    // console.log(req.user)
    // res.send("Ok")
    req.user.password = undefined
    const post = new Post({
        title,
        body,
        postedBy:req.user
    })
    post.save().then(result=>{
        res.json({post:result})
    })
    .catch(err=>{
        console.log(err);
    })
})

// mypost shows all posts which is posted by user in API after the login
router.get('/mypost',requireLogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("PostedBy","_id name email")
    .then(mypost=>{
        res.json({mypost})
    })
    .catch(err=>{
        console.log(err);
    })
})


module.exports = router