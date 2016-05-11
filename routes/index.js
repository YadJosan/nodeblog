var express = require('express');
var router = express.Router();
var mongo=require('mongodb');  
var db= require('monk')('localhost/nodeblog');
//Home page blog post
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  var db=req.db;
  var post=db.get('posts');
  post.find({},{},function(err,posts)
  {
  	res.render('index',{
  		"posts":posts
  	});
  });
});

module.exports = router;
