import _ from 'lodash';
import isLoggedIn from '../index.js'

import Blog from '../models/blogModel.js'

var RandomNumber =10;
var RandomNumberlg =10;
var googleIDNumber =10;

export const getPosts = function(req, res){
    RandomNumber = Math.floor((Math.random() * 10000) + 1);
    RandomNumberlg = Math.floor((Math.random() * 1000000) + 1);
    googleIDNumber = Math.floor((Math.random() * 100000000) + 1);
    const requestedTitle = _.lowerCase(req.params.postTitle)
        Blog.find({}, function(err, existsID){
            if (isLoggedIn.user){
                var visibility = true;
            }
            for (var i = 0 ; i < existsID.length ; i++) {
            
            if (requestedTitle === _.lowerCase(existsID[i].title)){
                return res.render('post', {
                id: existsID[i]._id,
                title: existsID[i].title,
                content: existsID[i].content,
                datetime: existsID[i].datetime,
                googleNO: googleIDNumber,
                gID: RandomNumber,
                lgID: RandomNumberlg,
                visibility: visibility
                })
            }
            }
        });
    }