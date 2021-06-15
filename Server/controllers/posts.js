import _ from 'lodash';

import Blog from '../models/blogModel.js'


export const getPosts = function(req, res){
    const requestedTitle = _.lowerCase(req.params.postTitle)
        Blog.find({}, function(err, existsID){
            for (var i = 0 ; i < existsID.length ; i++) {
            
            if (requestedTitle === _.lowerCase(existsID[i].title)){
                return res.render('post', {
                id: existsID[i]._id,
                title: existsID[i].title,
                content: existsID[i].content,
                datetime: existsID[i].datetime
                })
            }
            }
        });
    }