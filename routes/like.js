var express = require("express");
var router  = express.Router({mergeParams: true});
var Dish = require("../models/dish");
var Like= require("../models/like");
var middleware = require("../middleware");



//Comments Create
router.post("/", middleware.isLoggedIn, function(req,res){
    
    Dish.findById(req.params.id,function(err,dish){
        if(err){
            console.log(err);
            /*res.redirect("/dishes");
        */
        }else{
            Like.create(req.body.like, function(err,like){
                if(err){
                    console.log(err);
                }
                    else{
                        like.dish.id = req.params.id;
                       like.author.id=req.user._id;
                       like.author.like= req.body.like;
                       like.save();
                       dish.likes.push(like); 
                       dish.save();
                       console.log(like)
                       req.flash("success","You have liked it!");
                       res.redirect('/dishes/' + dish._id);
                    }
                
            });
        }
    });

});



//Unlike
router.post("/:like_id",middleware.isLoggedIn,function(req,res){


    Like.find({"author.id" : req.params.like_id,"dish.id":req.params.id}).populate("comments").populate("likes").remove().exec();
    console.log(req.params.like_id);
             res.redirect("/dishes/" + req.params.id);
});

module.exports = router;

