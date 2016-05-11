var express = require('express');
var router = express.Router();
var mongo=require('mongodb');
var db= require('monk')('localhost/nodeblog');

router.get('/show/:category',function (req,res,next) {
    var db = req.db;
    var posts = db.get('posts');
    posts.find({category:req.params.category},{},function (err,posts) {
        res.render('index',{
            'title':req.params.category,
            'posts':posts
        });
    });
});


router.get('/add',function (req,res,next) {
        res.render('addCategory',{
            'title':'Add Category'
        });
});

router.post('/add',function (req,res,next) {
    var title   =   req.body.title;
    req.checkBody('title','Title field is required').notEmpty();

    var errors  =   req.validationErrors();

    if(errors)
    {
            res.render('addCategory',{
                'errors':errors,
                'title':title
            });
    }
    else
    {
        var category= db.get('categories');

        category.insert({
            'title': title
        },function (err,category) {
            if(err)
            {
                res.send('There was an error issue submitting categories');
            }
            else
            {
                req.flash('success','Category Submitted');
                res.location('/');
                res.redirect('/');
            }
        })
    }


})


module.exports=router;