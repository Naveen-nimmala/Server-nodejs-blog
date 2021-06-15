import Blog from '../models/blogModel.js'
import express from 'express';
import bodyParser from 'body-parser';

const router = express.Router();

// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
router.use(bodyParser.json())



export const composePost =  async (req, res) => {
    var date = new Date();  
    var n = date.toDateString();
    var time = date.toLocaleTimeString();
    var dateTime = n + " " + time
    
    console.log(dateTime)
    const newPost = {
        title: req.body.postTitle,
        content: req.body.postData,
        datetime: dateTime
    };
   let wait = await Blog.insertMany(newPost, function(err){
    }) 
    // posts.push(post);
    res.redirect("/");
};
