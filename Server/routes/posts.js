import express from 'express';
import {getPosts} from '../controllers/posts.js'




const router = express.Router();


router.get("/:postTitle", getPosts)

export default router;

// app.get('/your/path', function(req, res) {
//     //viewname can include or omit the filename extension
//     res.render(__dirname + '../views/post'); 
// });​​​​​​​​​​