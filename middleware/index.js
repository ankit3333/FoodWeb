var Dish = require("../models/dish");
var Comment = require("../models/comment");

// All the Middlewares

var middlewareObj ={};

middlewareObj.checkDishOwnership = function(req,res,next){
     if(req.isAuthenticated()){
         Dish.findById(req.params.id, function(err,foundDish){
        if(err){
              req.flash("error", "Dish not found");
              res.redirect("back");
        }
     else{
         if(foundDish.author.id.equals(req.user._id)){
               next();
         }else{
                res.redirect("back");
        }
     }
    });
    }else{
        req.flash("error", "You don't have an access to this");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req,res,next){
     if(req.isAuthenticated()){
         Comment.findById(req.params.comment_id, function(err,foundComment){
        if(err){
              res.redirect("back");
        }
     else{
         if(foundComment.author.id.equals(req.user._id)){
               next();
         }else{
                req.flash("error","You don't have access to that");
                res.redirect("back");
        }
     }
    });
    }else{
        req.flash("error", "Please Login First.")
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login First");
    res.redirect("/login");
}




module.exports= middlewareObj;