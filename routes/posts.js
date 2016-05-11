var express = require('express');
var router = express.Router();
var mongo=require('mongodb');
var db= require('monk')('localhost/nodeblog');


router.get('/show/:id',function (req,res,next) {
    var post = db.get('posts');
    post.findById(req.params.id,function (error,post) {
        res.render('show',{
            'post':post
        });
    });

});

router.get('/add',function (req,res,next) {
    var categories  =db.get('categories');
    categories.find({},{},function (err,categories) {
        res.render('addpost',{
            'title':'Add Post',
            'categories':categories
        });
    });

});

router.post('/add',function (req,res,next) {
    console.log("POST IMAGE DATA");
    //Get the form values
    var title       = req.body.title;
    var category    =req.body.category;
    var body        =req.body.body;
    var author      =req.body.author;
    var date        = new Date();

    if(req.files.mainimage)
    {
        var mainImageOrignalName= req.files.mainimage.orignalname;
        var mainImageName   = req.files.mainimage.name;
        var mainImageMime   = req.files.mainimage.mimetype;
        var mainImagePath   = req.files.mainimage.path;
        var mainImageExt    = req.files.mainimage.extension;
        var mainImageSize   = req.files.mainimage.size;

    }else
    {
        var  mainImageName  = 'noimage.png';
    }

    // form validation
    req.checkBody('title','Title field is required').notEmpty();
    req.checkBody('category', 'Category feild is required').notEmpty();
    req.checkBody('body','Body field is required').notEmpty();
    req.checkBody('author','Author is required').notEmpty();

    //chech errors

    var errors  = req.validationErrors();
    if(errors)
    {
        res.render('addpost',{
            errors:errors,
            title:title,
            body:body
        })
    }
    else
    {
        var post    = db.get('posts');

        post.insert({
           'title':title,
            'category':category,
            'body':body,
            'author':author,
            'date':date,
            'mainimage':mainImageName
        },function (err,post) {
            if(err)
            {
                res.send('There was issue submit post');
            }
            else {
                req.flash('success', 'Post Submitted' );
                res.location('/');
                res.redirect('/');
            }

        });
    }


});

router.post('/addcomment',function (req,res,next) {
    //Get the form values
    var name       = req.body.name;
    var email    =req.body.email;
    var body        =req.body.body;
    var postid      =req.body.postid;
    var commentdate        = new Date();


    // form validation
    req.checkBody('name','Title field is required').notEmpty();
    req.checkBody('body', 'Body feild is required').notEmpty();
    req.checkBody('email','Body field is required').notEmpty();
    req.checkBody('email','Email is not Format correctuly').isEmail();

    //chech errors

    var errors  = req.validationErrors();
    if(errors)
    {
        var post    =db.get('posts');
        post.findById(post.id,function (err,post) {
            res.render('show',{
                'errors':errors,
                'post':post
            });
        });

    }
    else
    {
        var comment   = {'name':name,'email':email,'body':body, 'commentdate':commentdate};

        var posts = db.get('posts');
        posts.update({
            "_id":postid
        },
            {
                $push:{
                    "comments":comment
                }
            },function (err,doc) {
                if(err)
                {
                    throw err;
                }
                else
                {
                    req.flash('success','comment has saved successfully');
                    res.location('/posts/show/'+postid);
                    res.redirect('/posts/show/'+postid);
                }
            }); 
    }


});


module.exports=router;
