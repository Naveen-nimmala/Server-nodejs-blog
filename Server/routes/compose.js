import express from 'express';
import {composePost} from '../controllers/compose.js'
import bodyParser from 'body-parser';

import isLoggedIn from '../index.js'
import {profileData} from '../index.js'


import Blog from '../models/blogModel.js'

const router = express.Router();

const homeStartingContent = "Node.js is an open-source, cross-platform, back-end JavaScript runtime environment that runs on the V8 engine and executes JavaScript code outside a web browser";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";



router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

router.post("/", composePost);



router.get("/", function (req, res){
console.log( profileData.id )
if (isLoggedIn.user){
    if ( profileData.id == 108318296961391931070 ){
        res.render("compose")
    }else{
        Blog.find({}, function(err, fountItems){
            res.render("home", {
              startContent: homeStartingContent,
              posts: fountItems   
            });
          });
    }
}else{
    Blog.find({}, function(err, fountItems){
        res.render("home", {
          startContent: homeStartingContent,
          posts: fountItems   
        });
      });
    console.log("user no loggedin")
}
});

export default router;