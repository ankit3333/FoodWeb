var express = require("express");
var router  = express.Router({mergeParams: true});
var Dish = require("../models/dish");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// Comments New
router.get("/new", middleware.isLoggedIn , function(req, res) {
     Dish.findById(req.params.id, function(err,dish){
         if(err){
             console.log(err);
         }else{
            res.render("comments/new", {dish:dish});
         }
         
     });
    
});

//Comments Create
router.post("/", middleware.isLoggedIn, function(req,res){
    
    Dish.findById(req.params.id,function(err,dish){
        if(err){
            console.log(err);
            res.redirect("/dishes");
        }else{
            Comment.create(req.body.comment, function(err,comment){
                if(err){
                    console.log(err);
                }
                    else{
                       comment.author.id=req.user._id;
                       comment.author.username= req.user.username;
                       comment.save();
                       dish.comments.push(comment); 
                       dish.save();
                       req.flash("success","You have successfully added a comment!");
                       res.redirect('/dishes/' + dish._id);
                    }
                
            });
        }
    });

});

//Comments Edit
router.get("/:comment_id/edit",middleware.checkCommentOwnership, function(req,res){
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err){
            res.redirect("back");
        }else{
            res.render("comments/edit",{dish_id: req.params.id,comment:foundComment});
        }
    });
    
});

//Comment Update
router.put("/:comment_id",middleware.checkCommentOwnership, function(req,res){
Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      }else{
          res.redirect("/dishes/" + req.params.id);
      } 
   });
   
});

//Comment Delete
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
     Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            res.redirect("back");
        } else{
            req.flash("success","Comment Deleted");
            res.redirect("/dishes/" + req.params.id);
        }
     });
});

module.exports = router;

